interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { direction: "up" | "down" | "neutral"; label: string };
  accent?: string;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, unit, trend, accent = "#0B3D2E", icon }: StatCardProps) {
  const trendColor =
    trend?.direction === "up" ? "#166534" : trend?.direction === "down" ? "#991B1B" : "#6B7280";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E5E7EB",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: accent,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </div>
        <div style={{ color: "#9CA3AF" }}>{icon}</div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#1C1C1C",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 400 }}>{unit}</span>
        )}
      </div>

      {trend && (
        <div style={{ fontSize: "12px", color: trendColor, fontWeight: 500 }}>
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "—"} {trend.label}
        </div>
      )}
    </div>
  );
}
