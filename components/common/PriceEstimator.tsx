"use client";

import {
  Building2,
  LayoutTemplate,
  MonitorSmartphone,
  Newspaper,
  PenTool,
  ShoppingBag,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import {
  estimatorAddons,
  estimatorBudgets,
  estimatorServices,
  formatRp,
  type EstimatorAddonId,
  type EstimatorBudgetId,
  type EstimatorServiceId,
} from "@/lib/estimator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type EstimatorSelection = {
  serviceId: EstimatorServiceId | null;
  addonIds: EstimatorAddonId[];
  budgetId: EstimatorBudgetId | null;
};

type PriceEstimatorProps = {
  value: EstimatorSelection;
  onChange: (next: EstimatorSelection) => void;
  selectionError?: string;
  serviceError?: string;
};

const serviceIcons: Record<EstimatorServiceId, typeof LayoutTemplate> = {
  landing: LayoutTemplate,
  company: Building2,
  ecommerce: ShoppingCart,
  webapp: MonitorSmartphone,
};

const addonIcons: Record<EstimatorAddonId, typeof Newspaper> = {
  blog: Newspaper,
  store: ShoppingBag,
  copywriting: PenTool,
  maintenance: Wrench,
  api: Wrench,
};

export function PriceEstimator({
  value,
  onChange,
  selectionError,
  serviceError,
}: PriceEstimatorProps) {
  const { serviceId, addonIds, budgetId } = value;

  const service = estimatorServices.find((item) => item.id === serviceId);
  const selectedAddons = estimatorAddons.filter((item) =>
    addonIds.includes(item.id)
  );
  const subtotal =
    (service?.price ?? 0) +
    selectedAddons.reduce((sum, addon) => sum + (addon.price ?? 0), 0);
  const hasCustom =
    (service?.note ? true : false) ||
    selectedAddons.some((addon) => addon.price === null);

  const toggleAddon = (id: EstimatorAddonId) => {
    const next = addonIds.includes(id)
      ? addonIds.filter((addonId) => addonId !== id)
      : [...addonIds, id];
    onChange({ ...value, addonIds: next });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      {/* Kontrol pilihan */}
      <fieldset className="flex flex-col gap-7">
        <legend className="sr-only">Kebutuhan website Anda</legend>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Jenis Layanan
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {estimatorServices.map((item) => {
              const Icon = serviceIcons[item.id];
              const active = serviceId === item.id;
              return (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors duration-200",
                    active
                      ? "border-primary bg-primary/[0.06] dark:bg-primary/[0.08]"
                      : "border-border bg-surface hover:border-primary/40"
                  )}
                >
                  <input
                    type="radio"
                    name="estimator-service"
                    value={item.id}
                    checked={active}
                    onChange={() =>
                      onChange({ ...value, serviceId: item.id })
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      mulai dari {formatRp(item.price)}
                    </span>
                    {item.note ? (
                      <span className="text-xs text-muted">{item.note}</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
          {serviceError ? (
            <p role="alert" className="text-sm text-destructive">
              {serviceError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Fitur Tambahan <span className="font-normal text-muted">(opsional)</span>
          </h3>
          <div className="grid gap-2">
            {estimatorAddons.map((addon) => {
              const active = addonIds.includes(addon.id);
              const Icon = addonIcons[addon.id];
              return (
                <label
                  key={addon.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200",
                    active
                      ? "border-primary bg-primary/[0.06] dark:bg-primary/[0.08]"
                      : "border-border bg-surface hover:border-primary/40"
                  )}
                >
                  <input
                    type="checkbox"
                    name="estimator-addon"
                    value={addon.id}
                    checked={active}
                    onChange={() => toggleAddon(addon.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-transparent"
                    )}
                  >
                    {active ? (
                      <svg
                        viewBox="0 0 12 12"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 6.5 5 9l5-6" />
                      </svg>
                    ) : null}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary"
                  />
                  <span className="flex-1 text-sm text-foreground">
                    {addon.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {addon.price === null
                      ? "custom"
                      : `+${formatRp(addon.price)}`}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="estimator-budget">Perkiraan Budget</Label>
          <select
            id="estimator-budget"
            value={budgetId ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                budgetId: (event.target.value || null) as EstimatorBudgetId | null,
              })
            }
            aria-invalid={selectionError ? true : undefined}
            className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <option value="">Pilih perkiraan budget...</option>
            {estimatorBudgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.label}
              </option>
            ))}
          </select>
          {selectionError ? (
            <p role="alert" className="text-sm text-destructive">
              {selectionError}
            </p>
          ) : null}
        </div>
      </fieldset>

      {/* Ringkasan estimasi live */}
      <aside
        aria-label="Ringkasan estimasi"
        className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-28"
      >
        <h3 className="text-sm font-semibold text-foreground">Estimasi</h3>
        {service ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{service.label}</span>
              <span className="text-foreground">
                mulai dari {formatRp(service.price)}
              </span>
            </div>
            {selectedAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-muted-foreground">{addon.label}</span>
                <span className="text-foreground">
                  {addon.price === null
                    ? "custom"
                    : `+${formatRp(addon.price)}`}
                </span>
              </div>
            ))}
            <div aria-hidden="true" className="h-px w-full bg-border/70" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted-foreground">Estimasi awal</span>
              <span className="text-lg font-bold text-foreground">
                Mulai dari {formatRp(subtotal)}
              </span>
            </div>
            {hasCustom ? (
              <p className="text-xs leading-relaxed text-muted">
                Termasuk komponen custom — harga final menyesuaikan scope
                konsultasi.
              </p>
            ) : (
              <p className="text-xs leading-relaxed text-muted">
                Harga final dapat berubah setelah diskusi scope bersama tim.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Pilih jenis layanan untuk melihat estimasi awal.
          </p>
        )}
      </aside>
    </div>
  );
}


