export type EstimatorServiceId = "landing" | "company" | "ecommerce" | "webapp";

export type EstimatorAddonId =
  | "blog"
  | "store"
  | "copywriting"
  | "maintenance"
  | "api";

export type EstimatorBudgetId =
  | "below500k"
  | "1to2m"
  | "2to5m"
  | "above5m"
  | "above10m"
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
    price: 300_000,
  },
  {
    id: "company",
    label: "Company Profile",
    description:
      "Website multi-halaman profesional untuk membangun kredibilitas bisnis.",
    price: 800_000,
  },
  {
    id: "ecommerce",
    label: "E-commerce / Toko Online",
    description:
      "Toko online siap jualan — katalog, keranjang, pembayaran, dan ongkir.",
    price: 1_300_000,
  },
  {
    id: "webapp",
    label: "Web App / Dashboard",
    description:
      "Aplikasi web custom dengan login, database, dan dashboard.",
    price: 2_000_000,
    note: "Harga custom — menyesuaikan kompleksitas & fitur.",
  },
];

export const estimatorAddons: EstimatorAddon[] = [
  {
    id: "blog",
    label: "Blog / Artikel",
    price: 150_000,
  },
  {
    id: "store",
    label: "Toko online + payment gateway",
    price: 900_000,
  },
  {
    id: "copywriting",
    label: "Copywriting konten",
    price: 100_000,
  },
  {
    id: "maintenance",
    label: "Maintenance & support (1 bulan)",
    price: 50_000,
  },
  {
    id: "api",
    label: "Integrasi API / sistem",
    price: null,
    note: "Harga custom — menyesuaikan ruang lingkup integrasi.",
  },
];

export const allAddonIds = estimatorAddons.map(
  (addon) => addon.id
) as EstimatorAddonId[];

export const estimatorBudgets: EstimatorBudget[] = [
  { id: "below500k", label: "< Rp 500 ribu" },
  { id: "1to2m", label: "Rp 1–2 juta" },
  { id: "2to5m", label: "Rp 2–5 juta" },
  { id: "above5m", label: "Rp 5–8 juta" },
  { id: "above10m", label: "> Rp 8 juta" },
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

export type BudgetRange = { min: number; max: number | null };

export function getBudgetRange(id: EstimatorBudgetId): BudgetRange | null {
  switch (id) {
    case "below500k":
      return { min: 0, max: 500_000 };
    case "1to2m":
      return { min: 1_000_000, max: 2_000_000 };
    case "2to5m":
      return { min: 2_000_000, max: 5_000_000 };
    case "above5m":
      return { min: 5_000_000, max: 8_000_000 };
    case "above10m":
      return { min: 8_000_000, max: null };
    case "undecided":
      return null;
  }
}

export type BudgetMatch = {
  status: "under" | "near" | "over" | "none";
  message: string;
};

export function compareEstimateToBudget(
  subtotal: number,
  budgetId: EstimatorBudgetId
): BudgetMatch {
  const range = getBudgetRange(budgetId);
  if (!range || range.max === null) {
    return {
      status: "none",
      message: "Sesuaikan estimasi dengan budget yang tersedia di konsultasi.",
    };
  }
  const max = range.max;
  if (subtotal <= max) {
    const isNear = subtotal >= max * 0.9;
    return isNear
      ? {
          status: "near",
          message: `Estimasinya pas dengan budget. Siap mulai?`,
        }
      : {
          status: "under",
          message: `Estimasi di dalam budget Anda. Bisa ditambah fitur bila perlu.`,
        };
  }
  return {
    status: "over",
    message: `Estimasi melebihi budget. Konsultasikan untuk penyesuaian scope.`,
  };
}

export type BudgetRecommendation = {
  serviceId: EstimatorServiceId;
  addonIds: EstimatorAddonId[];
  reason: string;
};

export function getBudgetRecommendation(
  budgetId: EstimatorBudgetId
): BudgetRecommendation | null {
  switch (budgetId) {
    case "below500k":
      return {
        serviceId: "landing",
        addonIds: ["copywriting"],
        reason: "Landing page fokus konversi cocok untuk budget awal.",
      };
    case "1to2m":
      return {
        serviceId: "company",
        addonIds: ["blog"],
        reason: "Company profile multi-halaman membangun kredibilitas bisnis.",
      };
    case "2to5m":
      return {
        serviceId: "ecommerce",
        addonIds: ["store"],
        reason: "Toko online siap jualan dengan pembayaran terintegrasi.",
      };
    case "above5m":
      return {
        serviceId: "webapp",
        addonIds: [],
        reason: "Web app custom untuk kebutuhan kompleks dan skala besar.",
      };
    case "above10m":
      return {
        serviceId: "webapp",
        addonIds: ["blog", "store", "copywriting", "maintenance", "api"],
        reason: "Paket lengkap semua layanan untuk kebutuhan berskala besar.",
      };
    case "undecided":
      return {
        serviceId: "landing",
        addonIds: [],
        reason: "Landing page adalah titik awal yang baik untuk berjualan online.",
      };
  }
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