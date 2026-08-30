import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const allowedSizes = [192, 512] as const;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeParam = Number(searchParams.get("size"));
  if (!allowedSizes.includes(sizeParam as (typeof allowedSizes)[number])) {
    return new Response("Bad Request", { status: 400 });
  }
  const px = sizeParam as (typeof allowedSizes)[number];

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
    { width: px, height: px }
  );
}