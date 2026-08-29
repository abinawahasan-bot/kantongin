import { z } from "zod";
import {
  estimatorAddons,
  estimatorBudgets,
  estimatorServices,
  type EstimatorAddonId,
  type EstimatorBudgetId,
  type EstimatorServiceId,
} from "@/lib/estimator";

const serviceOptions = estimatorServices.map((item) => item.id) as [
  EstimatorServiceId,
  ...EstimatorServiceId[],
];
const addonOptions = estimatorAddons.map((item) => item.id) as [
  EstimatorAddonId,
  ...EstimatorAddonId[],
];
const budgetOptions = estimatorBudgets.map((item) => item.id) as [
  EstimatorBudgetId,
  ...EstimatorBudgetId[],
];

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Email tidak valid"),
  service: z.string().trim().min(1, "Pilih jenis layanan").max(80),
  subject: z.string().trim().min(1, "Subjek wajib diisi").max(120),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(4000),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const estimateContactSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Email tidak valid"),
  service: z.enum(serviceOptions, { message: "Pilih jenis layanan" }),
  addons: z.array(z.enum(addonOptions)),
  budget: z.enum(budgetOptions, { message: "Pilih perkiraan budget" }),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(4000),
});

export type EstimateContactValues = z.infer<typeof estimateContactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
