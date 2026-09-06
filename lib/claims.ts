import { createHash } from "node:crypto";

export type ClaimInput = {
  email: string;
  zip?: string;
  city?: string;
};

export type ClaimRecord = {
  email: string;
  zip: string;
  city: string;
  createdAt: string;
};

export type ClaimStoreKind = "kv" | "demo";

export type ClaimCountResult = {
  count: number;
  store: ClaimStoreKind;
};

export type ClaimSubmitResult = ClaimCountResult & {
  already: boolean;
};

const EMAIL_SET = "slice:v1:emails";
const CLAIM_LIST = "slice:v1:claims";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DemoState = {
  hashes: Set<string>;
  records: ClaimRecord[];
  seeded: boolean;
};

function demoState(): DemoState {
  const globalForClaims = globalThis as typeof globalThis & {
    __sliceClaims?: DemoState;
  };
  if (!globalForClaims.__sliceClaims) {
    globalForClaims.__sliceClaims = {
      hashes: new Set(),
      records: [],
      seeded: false,
    };
  }
  const state = globalForClaims.__sliceClaims;
  if (!state.seeded) {
    const seed = Number(process.env.SLICE_DEMO_SEED_COUNT ?? "0");
    if (Number.isFinite(seed) && seed > 0) {
      for (let i = 0; i < Math.min(10_000, Math.floor(seed)); i += 1) {
        state.hashes.add(`seed:${i}`);
      }
    }
    state.seeded = true;
  }
  return state;
}

function redisConfig(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token =
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

async function redisCommand(
  config: { url: string; token: string },
  command: Array<string | number>,
): Promise<unknown> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Claim store request failed (${response.status})`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) {
    throw new Error(payload.error);
  }
  return payload.result;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length > 3 && email.length <= 254 && EMAIL_RE.test(email);
}

export function normalizePlace(value: string | undefined, max: number): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

export function emailHash(email: string): string {
  const salt = process.env.CLAIM_HASH_SALT ?? "slice-nightly-365";
  return createHash("sha256").update(`${salt}:${email}`).digest("hex");
}

export function parseClaimInput(body: unknown): ClaimInput | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Please send an email." };
  }
  const record = body as Record<string, unknown>;
  if (typeof record.company === "string" && record.company.trim()) {
    return { error: "Could not save that just now." };
  }
  if (typeof record.email !== "string") {
    return { error: "Email is needed so we can reach you when a host deal is real." };
  }
  const email = normalizeEmail(record.email);
  if (!isValidEmail(email)) {
    return { error: "That email does not look usable." };
  }
  const zip = normalizePlace(
    typeof record.zip === "string" ? record.zip : undefined,
    16,
  );
  const city = normalizePlace(
    typeof record.city === "string" ? record.city : undefined,
    80,
  );
  return { email, zip, city };
}

export async function getClaimCount(): Promise<ClaimCountResult> {
  const config = redisConfig();
  if (!config) {
    return { count: demoState().hashes.size, store: "demo" };
  }
  const result = await redisCommand(config, ["SCARD", EMAIL_SET]);
  const count = typeof result === "number" ? result : Number(result ?? 0);
  return { count: Number.isFinite(count) ? count : 0, store: "kv" };
}

export async function submitClaim(
  input: ClaimInput,
): Promise<ClaimSubmitResult> {
  const email = normalizeEmail(input.email);
  const hash = emailHash(email);
  const record: ClaimRecord = {
    email,
    zip: input.zip ?? "",
    city: input.city ?? "",
    createdAt: new Date().toISOString(),
  };

  const config = redisConfig();
  if (!config) {
    const demo = demoState();
    const already = demo.hashes.has(hash);
    if (!already) {
      demo.hashes.add(hash);
      demo.records.push(record);
    }
    return { count: demo.hashes.size, store: "demo", already };
  }

  const added = await redisCommand(config, ["SADD", EMAIL_SET, hash]);
  const already = added === 0 || added === "0";
  if (!already) {
    await redisCommand(config, ["LPUSH", CLAIM_LIST, JSON.stringify(record)]);
  }
  const counted = await redisCommand(config, ["SCARD", EMAIL_SET]);
  const count = typeof counted === "number" ? counted : Number(counted ?? 0);
  return {
    count: Number.isFinite(count) ? count : 0,
    store: "kv",
    already,
  };
}
