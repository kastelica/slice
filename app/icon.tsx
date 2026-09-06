import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0b09",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "#c9a36a",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            background: "#0c0b09",
            transform: "translate(5px, -3px) rotate(28deg)",
          }}
        />
      </div>
    ),
    size,
  );
}
