import type { ExecutionStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ExecutionStatus | null;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  success: { label: "Success",  color: "#166534", bg: "#DCFCE7", dot: "#16A34A" },
  failed:  { label: "Failed",   color: "#991B1B", bg: "#FEE2E2", dot: "#DC2626" },
  timeout: { label: "Timeout",  color: "#92400E", bg: "#FEF3C7", dot: "#D97706" },
  pending: { label: "Pending",  color: "#374151", bg: "#F3F4F6", dot: "#9CA3AF" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  if (!status) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: size === "sm" ? "2px 6px" : "3px 8px",
          fontSize: size === "sm" ? "11px" : "12px",
          fontWeight: 500,
          backgroundColor: "#F3F4F6",
          color: "#6B7280",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#9CA3AF", flexShrink: 0 }} />
        N/A
      </span>
    );
  }

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: size === "sm" ? "2px 6px" : "3px 8px",
        fontSize: size === "sm" ? "11px" : "12px",
        fontWeight: 500,
        backgroundColor: cfg.bg,
        color: cfg.color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          backgroundColor: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
