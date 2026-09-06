import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0b09",
          padding: "72px 80px",
          color: "#efe8dc",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#9c9488",
          }}
        >
          Nightly 365 · Episode 1
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            Slice
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 860,
              fontSize: 36,
              lineHeight: 1.3,
              color: "#efe8dc",
            }}
          >
            If a data center comes to your area, you get money back.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#c9a36a" }}>
          A local host dividend
        </div>
      </div>
    ),
    size,
  );
}
