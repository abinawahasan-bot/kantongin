import { NextResponse } from "next/server";
import { siteConfig } from "@/constants/site";
import { getClientIp, rateLimitByIp } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/schemas/forms";

export const runtime = "nodejs";

const schema = newsletterSchema;

export async function POST(req: Request) {
  const limited = rateLimitByIp(`newsletter:${getClientIp(req)}`, 3, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan, coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let email: string;
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Masukkan alamat email yang valid." },
        { status: 400 }
      );
    }
    email = parsed.data.email;
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Layanan belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    await resend.contacts.create({ email, audienceId });
  }

  const { error } = await resend.emails.send({
    from: `KantongIn <newsletter@${process.env.RESEND_FROM_DOMAIN ?? "kantongin.com"}>`,
    to: [siteConfig.email],
    subject: "Langganan newsletter baru",
    html: `
      <div style="font-family:sans-serif;line-height:1.6">
        <h2>Ada langganan newsletter baru</h2>
        <p>Email: <strong>${email}</strong></p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Gagal memproses langganan, coba lagi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
