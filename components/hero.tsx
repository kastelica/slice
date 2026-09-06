import { SiteMark } from "@/components/site-mark";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <header className="pt-10 sm:pt-16">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SiteMark className="h-10 w-10 sm:h-12 sm:w-12" />
          <p className="font-serif text-2xl tracking-tight text-ink sm:text-[1.7rem]">
            {SITE.name}
          </p>
        </div>
        <nav
          aria-label="On this page"
          className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-[0.68rem] tracking-[0.14em] text-mute uppercase sm:gap-5 sm:text-[0.72rem] sm:tracking-[0.16em]"
        >
          <a href="#calculator" className="hover:text-ink">
            Calculator
          </a>
          <a href="#claim" className="hover:text-ink">
            Claim
          </a>
          <a href="#path" className="hover:text-ink">
            Path to law
          </a>
        </nav>
      </div>

      <p className="mt-12 text-[0.7rem] tracking-[0.28em] text-mute uppercase">
        {SITE.eyebrow}
      </p>
      <h1 className="mt-4 max-w-xl font-serif text-[2.35rem] leading-[1.08] tracking-tight text-ink sm:text-5xl">
        {SITE.pitch}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/88 sm:text-lg">
        {SITE.blurb}
      </p>
      <p className="mt-8 text-sm tracking-wide text-lamp">
        Local first. National is a secondary sketch.
      </p>
    </header>
  );
}
