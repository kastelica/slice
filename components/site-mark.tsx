type SiteMarkProps = {
  className?: string;
};

export function SiteMark({ className }: SiteMarkProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      role="img"
      aria-label="Slice"
      className={className}
    >
      <circle cx="40" cy="40" r="30" fill="#1a1712" stroke="#c9a36a" strokeWidth="2" />
      <path
        d="M40 40 L40 12 A28 28 0 0 1 66.2 54.8 Z"
        fill="#c9a36a"
      />
    </svg>
  );
}
