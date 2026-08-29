import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();
  if (!title) return new Response("Bad Request", { status: 400 });
  const subtitle = searchParams.get("subtitle")?.trim() || undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#020617",
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#22C55E",
            }}
          >
            <span>KantongIn</span>
          </div>
          <div
            style={{
              display: "flex",
              width: "64px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#22C55E",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#F8FAFC",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 500,
                color: "#94A3B8",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: "48px",
            bottom: "32px",
            fontSize: 20,
            fontWeight: 600,
            color: "#475569",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}