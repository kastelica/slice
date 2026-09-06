# Slice

If a data center comes to your area, you get money back.

A local host dividend: calculator, claims, and a one-page outline a council can start from. Built for Nightly 365 Episode 1.

Local is the headline. A national permit/levy sketch is there as a secondary toggle.

## Preview on your computer

```bash
npm install
cp .env.example .env.local   # optional — claims work without it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm start        # serve the build
npm run lint
```

## What is here

1. **Local host calculator** — campus size (MW), host fee ($ / MW-year or % of estimated power spend), people or households in the host area. You get the yearly pool, a per-resident check, a per-household check, and the formula in plain language.
2. **Claim** — “I want a share when a data center hosts near me.” Email required; zip and city optional. Live claimant count.
3. **Path to law** — copyable / downloadable one-page model ordinance and community-benefit outline. Trigger, obligation, payout, transparency. Names the real instruments: local ordinance, CBA, state bill. Starting text, not legal advice.
4. **Explainer** — why a local check is graspable, and the traps that make a fee dishonest.

## Environment

Copy `.env.example` to `.env.local`. Nothing is required for a demo.

| Variable | Needed? | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical URL for Open Graph / metadata |
| `KV_REST_API_URL` | Optional | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | Optional | Vercel KV REST token |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL (same protocol as KV) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST token |
| `CLAIM_HASH_SALT` | Optional | Extra salt for email uniqueness hashes |
| `SLICE_DEMO_SEED_COUNT` | Optional | Starting claimant count in demo mode (default `0`) |

Use **either** the `KV_*` pair **or** the `UPSTASH_*` pair. If neither pair is set, claims stay in memory on the running server. That is the demo fallback: the count updates while the instance is up, then resets when it sleeps. The page says so.

Stored per claim: email, optional zip, optional city, and a time. Duplicate emails are counted once.

## Deploy on Vercel

1. Import [this GitHub repository](https://github.com/kastelica/slice) in [Vercel](https://vercel.com/new). Framework preset: **Next.js**.
2. Leave env empty for a working demo, or add a KV / Upstash pair so claims persist.
3. Publish. `npm run build` is the production command.

To add persistence later:

1. In the Vercel project, create **KV** (or create an Upstash Redis database and paste the REST URL + token).
2. Redeploy so the new variables are live.
3. Claims and the public count then survive across instances.

## Tone

Helper language. No ship jargon. No personal names on the site. Footer links to [Nightly 365](https://nightly-365.vercel.app).
