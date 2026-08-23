import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Email tidak valid"),
  subject: z.string().trim().min(1, "Subjek wajib diisi").max(120),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(4000),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
