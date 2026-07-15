import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f2eee3",
          border: "4px solid #121311",
          color: "#121311",
          display: "flex",
          fontFamily: "Georgia, serif",
          fontSize: 45,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          lineHeight: 1,
          width: "100%",
        }}
      >
        U
      </div>
    ),
    size,
  );
}
