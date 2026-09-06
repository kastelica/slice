export const SITE = {
  name: "Slice",
  eyebrow: "Nightly 365 · Episode 1",
  pitch: "If a data center comes to your area, you get money back.",
  blurb:
    "A local host dividend: a fee on the campus, split equally among the people who live with it. Not a national essay — a check you can count, and starting text a council can actually use.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://slice.vercel.app",
  nightly: {
    name: "Nightly 365",
    href: "https://nightly-365.vercel.app",
  },
} as const;
