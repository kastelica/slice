import { claimShare } from "@/app/actions";
import { formatCount } from "@/lib/format";
import type { ClaimFlash } from "@/lib/query";
import { SectionLabel } from "@/components/section-label";

type ClaimFormProps = {
  count: number;
  store: "kv" | "demo";
  flash: ClaimFlash;
};

export function ClaimForm({ count, store, flash }: ClaimFormProps) {
  const countLabel =
    count === 1
      ? "1 person has asked for a share"
      : `${formatCount(count)} people have asked for a share`;

  return (
    <section id="claim" aria-labelledby="claim-heading" className="scroll-mt-8">
      <SectionLabel id="claim-heading" index="02" title="Claim a share" />
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/88">
        I want a share when a data center hosts near me. Leave an email. Zip or
        city helps place you on a map later — both are optional.
      </p>

      <p className="mt-5 font-serif text-2xl text-ink">{countLabel}</p>
      {store === "demo" ? (
        <p className="mt-2 text-sm text-mute">
          Demo count for this server. Add a Vercel KV / Upstash key to keep
          names across deploys.
        </p>
      ) : null}

      <form action={claimShare} className="mt-6 max-w-xl">
        <label htmlFor="claim-email" className="block text-sm text-ink">
          Email
        </label>
        <input
          id="claim-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 w-full rounded-lg border border-rule bg-night px-3 py-2.5 text-ink outline-none focus:border-lamp"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="claim-zip" className="block text-sm text-ink">
              Zip <span className="text-mute">(optional)</span>
            </label>
            <input
              id="claim-zip"
              name="zip"
              type="text"
              autoComplete="postal-code"
              className="mt-1.5 w-full rounded-lg border border-rule bg-night px-3 py-2.5 text-ink outline-none focus:border-lamp"
            />
          </div>
          <div>
            <label htmlFor="claim-city" className="block text-sm text-ink">
              City <span className="text-mute">(optional)</span>
            </label>
            <input
              id="claim-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              className="mt-1.5 w-full rounded-lg border border-rule bg-night px-3 py-2.5 text-ink outline-none focus:border-lamp"
            />
          </div>
        </div>

        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="claim-company">Company</label>
          <input
            id="claim-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm text-night"
        >
          I want a share
        </button>

        {flash.status === "ok" || flash.status === "already" ? (
          <p className="mt-3 text-sm text-lamp" role="status">
            {flash.message}
          </p>
        ) : null}
        {flash.status === "error" ? (
          <p className="mt-3 text-sm text-lamp" role="alert">
            {flash.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
