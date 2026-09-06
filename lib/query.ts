import {
  LOCAL_DEFAULTS,
  NATIONAL_DEFAULTS,
  type CalculatorMode,
  type FeeMode,
  type LocalInputs,
  type NationalInputs,
} from "@/lib/calculator";

export type SearchValues = Record<string, string | string[] | undefined>;

export type ClaimFlash = {
  status: "ok" | "already" | "error" | null;
  message: string;
};

function first(values: SearchValues, key: string): string {
  const value = values[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function num(values: SearchValues, key: string, fallback: number): number {
  const raw = Number(first(values, key));
  return Number.isFinite(raw) ? raw : fallback;
}

export function readMode(values: SearchValues): CalculatorMode {
  return first(values, "mode") === "national" ? "national" : "local";
}

export function readLocal(values: SearchValues): LocalInputs {
  const fee = first(values, "fee");
  const feeMode: FeeMode = fee === "percent_power" ? "percent_power" : "per_mw";
  return {
    megawatts: num(values, "mw", LOCAL_DEFAULTS.megawatts),
    feeMode,
    feePerMwYear: num(values, "rate", LOCAL_DEFAULTS.feePerMwYear),
    feePercent: num(values, "pct", LOCAL_DEFAULTS.feePercent),
    powerPricePerMwh: num(values, "price", LOCAL_DEFAULTS.powerPricePerMwh),
    capacityFactor: LOCAL_DEFAULTS.capacityFactor,
    residents: num(values, "people", LOCAL_DEFAULTS.residents),
    households: num(values, "homes", LOCAL_DEFAULTS.households),
  };
}

export function readNational(values: SearchValues): NationalInputs {
  return {
    surplusBillions: num(values, "surplus", NATIONAL_DEFAULTS.surplusBillions),
    ratePercent: num(values, "nrate", NATIONAL_DEFAULTS.ratePercent),
    population: num(values, "npop", NATIONAL_DEFAULTS.population),
  };
}

export function readClaimFlash(values: SearchValues): ClaimFlash {
  const claimed = first(values, "claimed");
  const error = first(values, "claimError");
  if (error) return { status: "error", message: error };
  if (claimed === "ok") {
    return {
      status: "ok",
      message:
        "You are on the list. When a host deal is real, this is how we find you.",
    };
  }
  if (claimed === "already") {
    return { status: "already", message: "This email is already on the list." };
  }
  return { status: null, message: "" };
}

export function localHref(inputs: LocalInputs): string {
  const params = new URLSearchParams({
    mode: "local",
    mw: String(inputs.megawatts),
    fee: inputs.feeMode,
    rate: String(inputs.feePerMwYear),
    pct: String(inputs.feePercent),
    price: String(inputs.powerPricePerMwh),
    people: String(inputs.residents),
    homes: String(inputs.households),
  });
  return `/?${params.toString()}#calculator`;
}

export function nationalHref(inputs: NationalInputs): string {
  const params = new URLSearchParams({
    mode: "national",
    surplus: String(inputs.surplusBillions),
    nrate: String(inputs.ratePercent),
    npop: String(inputs.population),
  });
  return `/?${params.toString()}#calculator`;
}
