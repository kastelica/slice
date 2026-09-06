export const HOURS_PER_YEAR = 8760;

export type FeeMode = "per_mw" | "percent_power";
export type ShareMode = "residents" | "households";
export type CalculatorMode = "local" | "national";

export type LocalInputs = {
  megawatts: number;
  feeMode: FeeMode;
  feePerMwYear: number;
  feePercent: number;
  powerPricePerMwh: number;
  capacityFactor: number;
  residents: number;
  households: number;
};

export type NationalInputs = {
  surplusBillions: number;
  ratePercent: number;
  population: number;
};

export type LocalResult = {
  annualPowerSpend: number;
  annualPool: number;
  perResident: number;
  perHousehold: number;
  formula: string;
};

export type NationalResult = {
  surplusUsd: number;
  annualPool: number;
  perPerson: number;
  formula: string;
};

export const LOCAL_DEFAULTS: LocalInputs = {
  megawatts: 150,
  feeMode: "per_mw",
  feePerMwYear: 50_000,
  feePercent: 2,
  powerPricePerMwh: 60,
  capacityFactor: 0.9,
  residents: 8_400,
  households: 3_400,
};

export const NATIONAL_DEFAULTS: NationalInputs = {
  surplusBillions: 400,
  ratePercent: 2,
  population: 340_000_000,
};

export type SizePreset = {
  id: string;
  label: string;
  hint: string;
  megawatts: number;
};

export const SIZE_PRESETS: SizePreset[] = [
  { id: "regional", label: "50 MW", hint: "Regional hall", megawatts: 50 },
  { id: "campus", label: "150 MW", hint: "Typical campus", megawatts: 150 },
  { id: "large", label: "300 MW", hint: "Large campus", megawatts: 300 },
  { id: "mega", label: "750 MW", hint: "Mega campus", megawatts: 750 },
];

export type PlacePreset = {
  id: string;
  label: string;
  residents: number;
  households: number;
};

export const PLACE_PRESETS: PlacePreset[] = [
  { id: "town", label: "Small town", residents: 8_400, households: 3_400 },
  { id: "county", label: "County", residents: 85_000, households: 34_000 },
  { id: "city", label: "Small city", residents: 220_000, households: 88_000 },
];

export type FeePreset = {
  id: string;
  label: string;
  feeMode: FeeMode;
  feePerMwYear?: number;
  feePercent?: number;
};

export const FEE_PRESETS: FeePreset[] = [
  { id: "modest", label: "$25k / MW", feeMode: "per_mw", feePerMwYear: 25_000 },
  { id: "mid", label: "$50k / MW", feeMode: "per_mw", feePerMwYear: 50_000 },
  { id: "strong", label: "$100k / MW", feeMode: "per_mw", feePerMwYear: 100_000 },
  { id: "pct2", label: "2% of power", feeMode: "percent_power", feePercent: 2 },
  { id: "pct5", label: "5% of power", feeMode: "percent_power", feePercent: 5 },
];

function clampPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

export function estimateAnnualPowerSpend(
  megawatts: number,
  powerPricePerMwh: number,
  capacityFactor: number,
): number {
  const mw = clampPositive(megawatts);
  const price = clampPositive(powerPricePerMwh);
  const factor = Math.min(1, clampPositive(capacityFactor));
  return mw * HOURS_PER_YEAR * factor * price;
}

export function calculateLocal(inputs: LocalInputs): LocalResult {
  const megawatts = clampPositive(inputs.megawatts);
  const feePerMwYear = clampPositive(inputs.feePerMwYear);
  const feePercent = clampPositive(inputs.feePercent);
  const powerPricePerMwh = clampPositive(inputs.powerPricePerMwh);
  const capacityFactor = Math.min(1, clampPositive(inputs.capacityFactor));
  const residents = clampPositive(inputs.residents);
  const households = clampPositive(inputs.households);

  const annualPowerSpend = estimateAnnualPowerSpend(
    megawatts,
    powerPricePerMwh,
    capacityFactor,
  );

  const annualPool =
    inputs.feeMode === "percent_power"
      ? annualPowerSpend * (feePercent / 100)
      : megawatts * feePerMwYear;

  const perResident = residents > 0 ? annualPool / residents : 0;
  const perHousehold = households > 0 ? annualPool / households : 0;

  const formula =
    inputs.feeMode === "percent_power"
      ? `Pool = ${megawatts} MW × 8,760 hours × ${pct(capacityFactor)} use × $${round(powerPricePerMwh)}/MWh × ${pct(feePercent / 100)} host fee. Then divide by the people (or households) who live here.`
      : `Pool = ${megawatts} MW × $${round(feePerMwYear)} per MW-year. Then divide by the people (or households) who live here.`;

  return {
    annualPowerSpend,
    annualPool,
    perResident,
    perHousehold,
    formula,
  };
}

export function calculateNational(inputs: NationalInputs): NationalResult {
  const surplusUsd = clampPositive(inputs.surplusBillions) * 1_000_000_000;
  const rate = clampPositive(inputs.ratePercent) / 100;
  const population = clampPositive(inputs.population);
  const annualPool = surplusUsd * rate;
  const perPerson = population > 0 ? annualPool / population : 0;

  return {
    surplusUsd,
    annualPool,
    perPerson,
    formula:
      "Pool = estimated yearly AI surplus × a public rate. Then divide by everyone in the country. Useful as a sketch — the local check is the one a town can actually attach to a permit.",
  };
}

function pct(value: number): string {
  return `${round(value * 100)}%`;
}

function round(value: number): string {
  if (Math.abs(value - Math.round(value)) < 0.05) {
    return String(Math.round(value));
  }
  return value.toFixed(1);
}
