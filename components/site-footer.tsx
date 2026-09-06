import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule pt-10 pb-16">
      <p className="font-serif text-lg text-ink">
        From{" "}
        <a
          href={SITE.nightly.href}
          className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-lamp"
        >
          {SITE.nightly.name}
        </a>
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
        Starting tools for a host community conversation. Not legal advice, and
        not a promise of a check — a way to make the idea feel real enough to
        take to a room.
      </p>
    </footer>
  );
}
