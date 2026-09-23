import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const stroke = Math.round(size.width * 0.016);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07080a",
      }}
    >
      <div
        style={{
          width: "58%",
          height: "76%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: `0 ${size.width * 0.06}px`,
          border: `${stroke}px solid #b98a4a`,
          borderRadius: `${size.width * 0.03}px`,
        }}
      >
        <div
          style={{
            width: "12%",
            height: "12%",
            borderRadius: "50%",
            background: "#e0b57a",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
