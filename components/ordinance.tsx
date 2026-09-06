"use client";

import { useState } from "react";
import { ORDINANCE_TEXT } from "@/lib/ordinance";
import { SectionLabel } from "@/components/section-label";

export function Ordinance() {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(ORDINANCE_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="path" aria-labelledby="path-heading" className="scroll-mt-8">
      <SectionLabel id="path-heading" index="03" title="Path to law" />
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/88">
        A national citizens&apos; dividend is a long essay. A local host
        dividend can start as a conversation with a council: a trigger, a fee,
        a pool, a check. The instruments already exist — a local ordinance, a
        community benefit agreement (CBA), or a state bill.
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
        The page below is starting text for that conversation. It is not legal
        advice and not a finished statute.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyText}
          className="rounded-full bg-ink px-4 py-2 text-sm text-night"
        >
          {copied ? "Copied" : "Copy the one-pager"}
        </button>
        <a
          href="/api/ordinance"
          className="rounded-full border border-rule px-4 py-2 text-sm text-ink hover:border-mute"
        >
          Download as text
        </a>
      </div>

      <article className="mt-6 rounded-2xl border border-rule bg-panel px-5 py-6 sm:px-7">
        <h3 className="font-serif text-2xl text-ink">
          Host community dividend
        </h3>
        <p className="mt-2 text-sm text-mute">One page. Plain language.</p>
        <ol className="mt-6 space-y-5 text-sm leading-relaxed text-ink/90 sm:text-[0.95rem]">
          <li>
            <span className="text-lamp">Trigger.</span> A data center over a
            set megawatt floor — 50 MW is a workable start — seeking a local
            permit, rezoning, abatement, or PILOT.
          </li>
          <li>
            <span className="text-lamp">Obligation.</span> An annual host fee
            into a resident pool, measured per megawatt or as a share of
            estimated power spend. Large enough to feel.
          </li>
          <li>
            <span className="text-lamp">Payout.</span> Equal resident or
            household dividend in the host jurisdiction. Same check for
            everyone who lives here.
          </li>
          <li>
            <span className="text-lamp">Transparency.</span> A public yearly
            report: size, fee, pool, recipients, and the per-person amount.
            Waivers stay public too.
          </li>
        </ol>
        <pre className="mt-6 overflow-x-auto whitespace-pre-wrap border-t border-rule pt-5 font-sans text-[0.8rem] leading-relaxed text-mute">
          {ORDINANCE_TEXT}
        </pre>
      </article>
    </section>
  );
}
