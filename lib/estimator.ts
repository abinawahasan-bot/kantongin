export type EstimatorServiceId = "landing" | "company" | "ecommerce" | "webapp";

export type EstimatorAddonId =
  | "blog"
  | "store"
  | "copywriting"
  | "maintenance"
  | "api";

export type EstimatorBudgetId =
  | "below1m"
  | "1to3m"
  | "3to5m"
  | "above5m"
  | "undecided";

export type EstimatorService = {
  id: EstimatorServiceId;
  label: string;
  description: string;
  price: number;
  note?: string;
};

export type EstimatorAddon = {
  id: EstimatorAddonId;
  label: string;
  price: number | null;
  note?: string;
};

export type EstimatorBudget = {
  id: EstimatorBudgetId;
  label: string;
};

export const estimatorServices: EstimatorService[] = [
  {
    id: "landing",
    label: "Landing Page",
    description:
      "Satu halaman fokus konversi untuk produk, kampanye, atau personal branding.",
    price: 500_000,
  },
  {
    id: "company",
    label: "Company Profile",
    description:
      "Website multi-halaman profesional untuk membangun kredibilitas bisnis.",
    price: 1_300_000,
  },
  {
    id: "ecommerce",
    label: "E-commerce / Toko Online",
    description:
      "Toko online siap jualan — katalog, keranjang, pembayaran, dan ongkir.",
    price: 2_500_000,
  },
  {
    id: "webapp",
    label: "Web App / Dashboard",
    description:
      "Aplikasi web custom dengan login, database, dan dashboard.",
    price: 5_000_000,
    note: "Harga custom — menyesuaikan kompleksitas & fitur.",
  },
];

export const estimatorAddons: EstimatorAddon[] = [
  {
    id: "blog",
    label: "Blog / Artikel",
    price: 300_000,
  },
  {
    id: "store",
    label: "Toko online + payment gateway",
    price: 1_500_000,
  },
  {
    id: "copywriting",
    label: "Copywriting konten",
    price: 250_000,
  },
  {
    id: "maintenance",
    label: "Maintenance & support (1 bulan)",
    price: 150_000,
  },
  {
    id: "api",
    label: "Integrasi API / sistem",
    price: null,
    note: "Harga custom — menyesuaikan ruang lingkup integrasi.",
  },
];

export const estimatorBudgets: EstimatorBudget[] = [
  { id: "below1m", label: "< Rp 1 juta" },
  { id: "1to3m", label: "Rp 1–3 juta" },
  { id: "3to5m", label: "Rp 3–5 juta" },
  { id: "above5m", label: "> Rp 5 juta" },
  { id: "undecided", label: "Belum tahu" },
];

export function getService(
  id: EstimatorServiceId
): EstimatorService | undefined {
  return estimatorServices.find((service) => service.id === id);
}

export function getAddon(id: EstimatorAddonId): EstimatorAddon | undefined {
  return estimatorAddons.find((addon) => addon.id === id);
}

export function getBudget(id: EstimatorBudgetId): EstimatorBudget | undefined {
  return estimatorBudgets.find((budget) => budget.id === id);
}

export type EstimateResult = {
  service: EstimatorService;
  addons: EstimatorAddon[];
  subtotal: number;
  hasCustom: boolean;
  estimateLabel: string;
};

export function formatRp(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function computeEstimate(
  serviceId: EstimatorServiceId,
  addonIds: EstimatorAddonId[]
): EstimateResult {
  const service = getService(serviceId);
  if (!service) {
    throw new Error(`Unknown service: ${serviceId}`);
  }

  const addons = addonIds
    .map((id) => getAddon(id))
    .filter((addon): addon is EstimatorAddon => Boolean(addon));

  const subtotal =
    service.price +
    addons.reduce((sum, addon) => sum + (addon.price ?? 0), 0);

  const hasCustom = Boolean(service.note) || addons.some((a) => a.price === null);

  return {
    service,
    addons,
    subtotal,
    hasCustom,
    estimateLabel: `Mulai dari ${formatRp(subtotal)}`,
  };
}

export function isServiceId(value: string): value is EstimatorServiceId {
  return estimatorServices.some((service) => service.id === value);
}

export function isAddonId(value: string): value is EstimatorAddonId {
  return estimatorAddons.some((addon) => addon.id === value);
}

export function isBudgetId(value: string): value is EstimatorBudgetId {
  return estimatorBudgets.some((budget) => budget.id === value);
}

export type EstimatePayload = {
  s: EstimatorServiceId;
  a: EstimatorAddonId[];
  b: EstimatorBudgetId;
};

export function encodeEstimatePayload(payload: EstimatePayload): string {
  return JSON.stringify(payload);
}

export function decodeEstimatePayload(
  raw: string | null | undefined
): EstimatePayload | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("s" in parsed) ||
      !("a" in parsed) ||
      !("b" in parsed)
    ) {
      return null;
    }
    const { s, a, b } = parsed as Record<string, unknown>;
    if (
      typeof s !== "string" ||
      !isServiceId(s) ||
      typeof b !== "string" ||
      !isBudgetId(b) ||
      !Array.isArray(a)
    ) {
      return null;
    }
    const addons = a.filter((id): id is EstimatorAddonId => typeof id === "string" && isAddonId(id));
    return { s, a: addons, b };
  } catch {
    return null;
  }
}