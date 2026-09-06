import { Calculator } from "@/components/calculator";
import { ClaimForm } from "@/components/claim-form";
import { Explainer } from "@/components/explainer";
import { Hero } from "@/components/hero";
import { Ideas } from "@/components/ideas";
import { Ordinance } from "@/components/ordinance";
import { SiteFooter } from "@/components/site-footer";
import { getClaimCount } from "@/lib/claims";
import {
  readClaimFlash,
  readLocal,
  readMode,
  readNational,
} from "@/lib/query";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const claims = await getClaimCount().catch(() => ({
    count: 0,
    store: "demo" as const,
  }));

  return (
    <div className="home-dusk mx-auto w-full max-w-3xl px-5 sm:px-8">
      <a
        href="#calculator"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-5 focus:z-10 focus:bg-panel focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to calculator
      </a>
      <Hero />
      <main className="mt-16 flex flex-col gap-20 pb-6 sm:mt-20 sm:gap-24">
        <Ideas />
        <Calculator
          mode={readMode(params)}
          local={readLocal(params)}
          national={readNational(params)}
        />
        <ClaimForm
          count={claims.count}
          store={claims.store}
          flash={readClaimFlash(params)}
        />
        <Ordinance />
        <Explainer />
      </main>
      <SiteFooter />
    </div>
  );
}
