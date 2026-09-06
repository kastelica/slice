type Bucket = {
  hits: number[];
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;

function store(): Map<string, Bucket> {
  const globalForLimit = globalThis as typeof globalThis & {
    __sliceRate?: Map<string, Bucket>;
  };
  if (!globalForLimit.__sliceRate) {
    globalForLimit.__sliceRate = new Map();
  }
  return globalForLimit.__sliceRate;
}

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const buckets = store();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);
  if (bucket.hits.length >= MAX_HITS) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return true;
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
