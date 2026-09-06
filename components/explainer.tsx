import { SectionLabel } from "@/components/section-label";

export function Explainer() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="scroll-mt-8"
    >
      <SectionLabel id="why-heading" index="04" title="Why this can work" />
      <div className="mt-5 space-y-5 text-base leading-relaxed text-ink/88">
        <p>
          A local host dividend is graspable. You can see the building. A
          council can attach a condition to a permit it already grants. The
          check, in a small place, can be large enough to notice — which is why
          the calculator leads with the town, not the nation.
        </p>
        <p>
          The idea stays kind only if it stays honest. A fee that is a rounding
          error is not a dividend. If housing and land jump when the campus
          lands, the check can be eaten before it arrives. Exemptions, “jobs
          only” deals, and quiet sunset clauses can empty the pool while the
          lights stay on.
        </p>
        <p>
          None of that means the idea is bad. It means the writing should be
          plain, the map should include the people next to the fence, and the
          report should be public. Slice is a starting room for that work —
          count the check, ask for a share, take a one-pager to a meeting.
        </p>
      </div>
    </section>
  );
}
