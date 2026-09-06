import { getClaimCount, parseClaimInput, submitClaim } from "@/lib/claims";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getClaimCount();
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Could not read the claimant count just now." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request))) {
    return Response.json(
      { error: "Please wait a few minutes and try once more." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send an email." }, { status: 400 });
  }

  const parsed = parseClaimInput(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await submitClaim(parsed);
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Could not save that just now. Please try again." },
      { status: 503 },
    );
  }
}
