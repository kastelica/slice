const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const countFormat = new Intl.NumberFormat("en-US");

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  return abs >= 100 ? usdWhole.format(value) : usdPrecise.format(value);
}

export function formatUsdExact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return usdPrecise.format(value);
}

export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return countFormat.format(Math.max(0, Math.round(value)));
}

export function formatCompactUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000) {
    return `${sign}$${trimNum(abs / 1_000_000_000_000)} trillion`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}$${trimNum(abs / 1_000_000_000)} billion`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${trimNum(abs / 1_000_000)} million`;
  }
  return formatUsd(value);
}

function trimNum(n: number): string {
  return n
    .toFixed(n >= 10 ? 0 : 1)
    .replace(/\.0$/, "");
}
