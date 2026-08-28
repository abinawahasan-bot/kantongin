import { NextResponse } from "next/server";
import { siteConfig } from "@/constants/site";
import { getClientIp, rateLimitByIp } from "@/lib/rate-limit";
import { contactSchema, type ContactValues } from "@/lib/schemas/forms";

export const runtime = "nodejs";

const schema = contactSchema;

export async function POST(req: Request) {
  const limited = await rateLimitByIp(`contact:${getClientIp(req)}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan, coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let data: ContactValues;
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Periksa kembali isian Anda.", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    data = parsed.data;
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromDomain = process.env.RESEND_FROM_DOMAIN;
  if (!apiKey || !fromDomain || !siteConfig.email) {
    return NextResponse.json(
      { error: "Layanan belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `KantongIn <kontak@${fromDomain}>`,
    to: [siteConfig.email],
    replyTo: data.email,
    subject: `[Kontak] ${data.subject}`,
    html: `
      <div style="font-family:sans-serif;line-height:1.6">
        <h2>Pesan baru dari form kontak</h2>
        <p><strong>Nama:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subjek:</strong> ${data.subject}</p>
        <p><strong>Pesan:</strong></p>
        <blockquote style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px;margin:0">${data.message}</blockquote>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengirim pesan, coba lagi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
