"use client";

import { useEffect, useState, type FormEvent } from "react";
import { formatCount } from "@/lib/format";
import { SectionLabel } from "@/components/section-label";

type ClaimsResponse = {
  count?: number;
  store?: "kv" | "demo";
  already?: boolean;
  error?: string;
};

export function ClaimForm() {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [store, setStore] = useState<"kv" | "demo" | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "already">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/claims", { cache: "no-store" })
      .then((response) => response.json() as Promise<ClaimsResponse>)
      .then((data) => {
        if (cancelled || typeof data.count !== "number") return;
        setCount(data.count);
        setStore(data.store ?? null);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("saving");
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zip, city, company }),
      });
      const data = (await response.json()) as ClaimsResponse;
      if (!response.ok || data.error) {
        setStatus("idle");
        setError(data.error ?? "Could not save that just now.");
        return;
      }
      if (typeof data.count === "number") setCount(data.count);
      if (data.store) setStore(data.store);
      setStatus(data.already ? "already" : "saved");
    } catch {
      setStatus("idle");
      setError("Could not save that just now. Please try again.");
    }
  }

  const countLabel =
    count === null
      ? "Reading the room…"
      : count === 1
        ? "1 person has asked for a share"
        : `${formatCount(count)} people have asked for a share`;

  return (
    <section id="claim" aria-labelledby="claim-heading" className="scroll-mt-8">
      <SectionLabel id="claim-heading" index="02" title="Claim a share" />
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/88">
        I want a share when a data center hosts near me. Leave an email. Zip or
        city helps place you on a map later — both are optional.
      </p>

      <p className="mt-5 font-serif text-2xl text-ink" aria-live="polite">
        {countLabel}
      </p>
      {store === "demo" ? (
        <p className="mt-2 text-sm text-mute">
          Demo count for this server. Add a Vercel KV / Upstash key to keep
          names across deploys.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 max-w-xl">
        <label htmlFor="claim-email" className="block text-sm text-ink">
          Email
        </label>
        <input
          id="claim-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
              value={zip}
              onChange={(event) => setZip(event.target.value)}
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
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-rule bg-night px-3 py-2.5 text-ink outline-none focus:border-lamp"
            />
          </div>
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="claim-company">Company</label>
          <input
            id="claim-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm text-night transition-opacity disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "I want a share"}
        </button>

        {status === "saved" ? (
          <p className="mt-3 text-sm text-lamp" role="status">
            You are on the list. When a host deal is real, this is how we find
            you.
          </p>
        ) : null}
        {status === "already" ? (
          <p className="mt-3 text-sm text-lamp" role="status">
            This email is already on the list.
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-lamp" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
