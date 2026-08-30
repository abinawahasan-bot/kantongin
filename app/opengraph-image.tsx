import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const runtime = "nodejs";

export const alt = "KantongIn — " + siteConfig.tagline;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#F8FAFC",
          }}
        >
          Kantong
          <span style={{ color: "#22C55E" }}>In</span>
          <span style={{ color: "#22C55E" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            fontWeight: 500,
            color: "#94A3B8",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
