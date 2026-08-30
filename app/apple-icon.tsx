import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72%",
            height: "72%",
            borderRadius: "24%",
            backgroundColor: "#22C55E",
          }}
        >
          <span
            style={{
              fontSize: "52%",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "#020617",
            }}
          >
            K
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}