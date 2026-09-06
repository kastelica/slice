const IDEAS = [
  "If a data center drinks your town’s power and water, why don’t your neighbors get a check?",
  "Alaska got oil checks. What’s our compute check?",
  "Don’t ask AI for a job — ask who owns the machines.",
  "Permits are the new payroll.",
  "Your ZIP hosts the GPUs → your ZIP gets a cut.",
] as const;

export function Ideas() {
  return (
    <section
      id="ideas"
      aria-labelledby="ideas-heading"
      className="scroll-mt-8"
    >
      <p
        id="ideas-heading"
        className="text-[0.7rem] tracking-[0.22em] text-mute uppercase"
      >
        Ideas worth repeating
      </p>
      <ol className="mt-4 divide-y divide-rule border-y border-rule">
        {IDEAS.map((idea, index) => (
          <li key={idea} className="flex gap-4 py-4 sm:gap-6">
            <span className="w-6 shrink-0 pt-1 text-[0.68rem] tracking-[0.16em] text-lamp">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-serif text-xl leading-snug text-ink sm:text-[1.35rem]">
              {idea}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
