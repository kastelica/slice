type SectionLabelProps = {
  id: string;
  index: string;
  title: string;
};

export function SectionLabel({ id, index, title }: SectionLabelProps) {
  return (
    <div className="flex items-baseline gap-4 border-b border-rule pb-3">
      <span className="text-[0.7rem] tracking-[0.22em] text-mute">{index}</span>
      <h2 id={id} className="text-sm tracking-[0.18em] uppercase text-ink">
        {title}
      </h2>
    </div>
  );
}
