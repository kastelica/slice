"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  calculateLocal,
  calculateNational,
  FEE_PRESETS,
  PLACE_PRESETS,
  SIZE_PRESETS,
  type CalculatorMode,
  type FeeMode,
  type LocalInputs,
  type NationalInputs,
} from "@/lib/calculator";
import { formatCompactUsd, formatCount, formatUsd } from "@/lib/format";
import { localHref, nationalHref } from "@/lib/query";
import { SectionLabel } from "@/components/section-label";

type CalculatorProps = {
  mode: CalculatorMode;
  local: LocalInputs;
  national: NationalInputs;
};

export function Calculator({
  mode: initialMode,
  local: initialLocal,
  national: initialNational,
}: CalculatorProps) {
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [local, setLocal] = useState<LocalInputs>(initialLocal);
  const [national, setNational] = useState<NationalInputs>(initialNational);

  const localResult = useMemo(() => calculateLocal(local), [local]);
  const nationalResult = useMemo(() => calculateNational(national), [national]);

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="scroll-mt-8"
    >
      <SectionLabel id="calculator-heading" index="01" title="Calculator" />
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/88">
        Start with a campus near you. Change the size, the host fee, and who
        shares it. The number updates as you go.
      </p>

      <div
        className="mt-6 inline-flex rounded-full border border-rule bg-panel p-1"
        role="tablist"
        aria-label="Calculator mode"
      >
        <ModeTab
          active={mode === "local"}
          href={localHref(local)}
          onClick={() => setMode("local")}
          label="Local host"
        />
        <ModeTab
          active={mode === "national"}
          href={nationalHref(national)}
          onClick={() => setMode("national")}
          label="National sketch"
        />
      </div>

      {mode === "local" ? (
        <LocalPanel
          value={local}
          onChange={setLocal}
          pool={localResult.annualPool}
          perResident={localResult.perResident}
          perHousehold={localResult.perHousehold}
          powerSpend={localResult.annualPowerSpend}
          formula={localResult.formula}
        />
      ) : (
        <NationalPanel
          value={national}
          onChange={setNational}
          pool={nationalResult.annualPool}
          perPerson={nationalResult.perPerson}
          formula={nationalResult.formula}
        />
      )}
    </section>
  );
}

function ModeTab({
  active,
  href,
  onClick,
  label,
}: {
  active: boolean;
  href: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <a
      href={href}
      role="tab"
      aria-selected={active}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
        active ? "bg-ink text-night" : "text-mute hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}

function LocalPanel({
  value,
  onChange,
  pool,
  perResident,
  perHousehold,
  powerSpend,
  formula,
}: {
  value: LocalInputs;
  onChange: (next: LocalInputs) => void;
  pool: number;
  perResident: number;
  perHousehold: number;
  powerSpend: number;
  formula: string;
}) {
  const patch = (partial: Partial<LocalInputs>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="mt-8">
      <Fieldset legend="Data center size">
        <PresetRow>
          {SIZE_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              href={localHref({ ...value, megawatts: preset.megawatts })}
              active={value.megawatts === preset.megawatts}
              onClick={() => patch({ megawatts: preset.megawatts })}
              label={preset.label}
              hint={preset.hint}
            />
          ))}
        </PresetRow>
        <NumberField
          id="megawatts"
          label="Power draw (MW)"
          hint="Permitted or expected megawatts."
          value={value.megawatts}
          min={1}
          step={10}
          onChange={(megawatts) => patch({ megawatts })}
        />
      </Fieldset>

      <Fieldset legend="Host fee">
        <div className="mb-3 flex gap-2">
          <FeeModeButton
            href={localHref({ ...value, feeMode: "per_mw" })}
            active={value.feeMode === "per_mw"}
            onClick={() => patch({ feeMode: "per_mw" })}
            label="$ / MW-year"
          />
          <FeeModeButton
            href={localHref({ ...value, feeMode: "percent_power" })}
            active={value.feeMode === "percent_power"}
            onClick={() => patch({ feeMode: "percent_power" })}
            label="% of power spend"
          />
        </div>
        <PresetRow>
          {FEE_PRESETS.map((preset) => {
            const next = {
              ...value,
              feeMode: preset.feeMode,
              ...(preset.feePerMwYear != null
                ? { feePerMwYear: preset.feePerMwYear }
                : {}),
              ...(preset.feePercent != null
                ? { feePercent: preset.feePercent }
                : {}),
            };
            return (
              <Chip
                key={preset.id}
                href={localHref(next)}
                active={isFeePresetActive(value, preset.feeMode, preset)}
                onClick={() => patch(next)}
                label={preset.label}
              />
            );
          })}
        </PresetRow>
        {value.feeMode === "per_mw" ? (
          <NumberField
            id="fee-per-mw"
            label="Dollars per MW each year"
            hint="A mid starting point is $50,000."
            value={value.feePerMwYear}
            min={0}
            step={1000}
            onChange={(feePerMwYear) => patch({ feePerMwYear })}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              id="fee-percent"
              label="Share of power spend (%)"
              hint="Two percent is a mid sketch."
              value={value.feePercent}
              min={0}
              step={0.5}
              onChange={(feePercent) => patch({ feePercent })}
            />
            <NumberField
              id="power-price"
              label="Power price ($ / MWh)"
              hint="Used only for the percent sketch."
              value={value.powerPricePerMwh}
              min={0}
              step={5}
              onChange={(powerPricePerMwh) => patch({ powerPricePerMwh })}
            />
          </div>
        )}
      </Fieldset>

      <Fieldset legend="Who shares the pool">
        <PresetRow>
          {PLACE_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              href={localHref({
                ...value,
                residents: preset.residents,
                households: preset.households,
              })}
              active={
                value.residents === preset.residents &&
                value.households === preset.households
              }
              onClick={() =>
                patch({
                  residents: preset.residents,
                  households: preset.households,
                })
              }
              label={preset.label}
            />
          ))}
        </PresetRow>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            id="residents"
            label="People in the host area"
            hint="Town, city, or county population."
            value={value.residents}
            min={1}
            step={100}
            onChange={(residents) => patch({ residents })}
          />
          <NumberField
            id="households"
            label="Households in the host area"
            hint="If you would rather split by home."
            value={value.households}
            min={1}
            step={50}
            onChange={(households) => patch({ households })}
          />
        </div>
      </Fieldset>

      <ResultCard>
        <p className="text-[0.7rem] tracking-[0.2em] text-lamp uppercase">
          Annual host pool
        </p>
        <p className="mt-2 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          {formatUsd(pool)}
        </p>
        <p className="mt-2 text-sm text-mute">
          {formatCompactUsd(pool)} a year from this campus.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stat
            label="Per resident"
            value={formatUsd(perResident)}
            hint="If the pool is split by people."
          />
          <Stat
            label="Per household"
            value={formatUsd(perHousehold)}
            hint="If the pool is split by homes."
          />
        </dl>
        {value.feeMode === "percent_power" ? (
          <p className="mt-5 text-sm text-mute">
            Estimated power spend: {formatUsd(powerSpend)} a year (
            {formatCount(value.megawatts)} MW × 8,760 hours ×{" "}
            {Math.round(value.capacityFactor * 100)}% use × $
            {value.powerPricePerMwh}/MWh).
          </p>
        ) : null}
        <p className="mt-5 text-sm leading-relaxed text-ink/80">{formula}</p>
      </ResultCard>
    </div>
  );
}

function NationalPanel({
  value,
  onChange,
  pool,
  perPerson,
  formula,
}: {
  value: NationalInputs;
  onChange: (next: NationalInputs) => void;
  pool: number;
  perPerson: number;
  formula: string;
}) {
  const patch = (partial: Partial<NationalInputs>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="mt-8">
      <p className="max-w-xl text-sm leading-relaxed text-mute">
        A national permit or levy on AI surplus. Keep this as a sketch — a town
        can attach a host fee to a building it can see.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <NumberField
          id="surplus"
          label="AI surplus ($ billions)"
          hint="A yearly surplus sketch."
          value={value.surplusBillions}
          min={0}
          step={25}
          onChange={(surplusBillions) => patch({ surplusBillions })}
        />
        <NumberField
          id="national-rate"
          label="Public rate (%)"
          hint="Share taken for everyone."
          value={value.ratePercent}
          min={0}
          step={0.5}
          onChange={(ratePercent) => patch({ ratePercent })}
        />
        <NumberField
          id="national-pop"
          label="Population"
          hint="Who the pool is divided among."
          value={value.population}
          min={1}
          step={1_000_000}
          onChange={(population) => patch({ population })}
        />
      </div>
      <ResultCard>
        <p className="text-[0.7rem] tracking-[0.2em] text-lamp uppercase">
          National pool
        </p>
        <p className="mt-2 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          {formatCompactUsd(pool)}
        </p>
        <dl className="mt-6">
          <Stat
            label="Per person"
            value={formatUsd(perPerson)}
            hint="Smaller than a local check, and harder to attach to a permit."
          />
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-ink/80">{formula}</p>
      </ResultCard>
    </div>
  );
}

function isFeePresetActive(
  value: LocalInputs,
  feeMode: FeeMode,
  preset: { feePerMwYear?: number; feePercent?: number },
): boolean {
  if (value.feeMode !== feeMode) return false;
  if (feeMode === "per_mw") {
    return value.feePerMwYear === preset.feePerMwYear;
  }
  return value.feePercent === preset.feePercent;
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mb-8">
      <legend className="mb-3 text-[0.72rem] tracking-[0.18em] text-mute uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function PresetRow({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  href,
  active,
  onClick,
  label,
  hint,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      aria-current={active ? "true" : undefined}
      className={`rounded-full border px-3 py-1.5 text-left text-sm transition-colors ${
        active
          ? "border-lamp bg-lamp/15 text-ink"
          : "border-rule text-mute hover:border-mute hover:text-ink"
      }`}
    >
      <span>{label}</span>
      {hint ? (
        <span className="ml-1.5 hidden text-xs text-mute sm:inline">{hint}</span>
      ) : null}
    </a>
  );
}

function FeeModeButton({
  href,
  active,
  onClick,
  label,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      aria-current={active ? "true" : undefined}
      className={`rounded-full border px-3 py-1.5 text-sm ${
        active
          ? "border-ink bg-ink text-night"
          : "border-rule text-mute hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}

function NumberField({
  id,
  label,
  hint,
  value,
  min,
  step,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="mt-3 block">
      <span className="text-sm text-ink">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => {
          const next = event.target.valueAsNumber;
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className="mt-1.5 w-full rounded-lg border border-rule bg-panel px-3 py-2.5 text-ink outline-none focus:border-lamp"
      />
      <span className="mt-1.5 block text-xs leading-relaxed text-mute">
        {hint}
      </span>
    </label>
  );
}

function ResultCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-rule bg-panel px-5 py-6 sm:px-7 sm:py-8">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <dt className="text-[0.7rem] tracking-[0.16em] text-mute uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-3xl tracking-tight text-ink">
        {value}
      </dd>
      <p className="mt-1 text-xs leading-relaxed text-mute">{hint}</p>
    </div>
  );
}
