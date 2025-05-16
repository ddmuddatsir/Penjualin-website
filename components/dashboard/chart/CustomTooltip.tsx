import { TooltipProps } from "recharts";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          color: "oklch(0.372 0.044 257.287)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        <p style={{ margin: 0 }}>
          Total:{" "}
          <span style={{ color: "oklch(0.457 0.24 277.023)" }}>
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }

  return null;
};
