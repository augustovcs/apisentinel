import type { HttpMethod } from "@/lib/types";

interface MethodBadgeProps {
  method: HttpMethod;
}

const METHOD_CONFIG: Record<HttpMethod, { color: string; bg: string }> = {
  GET:     { color: "#166534", bg: "#DCFCE7" },
  POST:    { color: "#1E40AF", bg: "#DBEAFE" },
  PUT:     { color: "#92400E", bg: "#FEF3C7" },
  PATCH:   { color: "#5B21B6", bg: "#EDE9FE" },
  DELETE:  { color: "#991B1B", bg: "#FEE2E2" },
  HEAD:    { color: "#374151", bg: "#F3F4F6" },
  OPTIONS: { color: "#374151", bg: "#F3F4F6" },
};

export default function MethodBadge({ method }: MethodBadgeProps) {
  const cfg = METHOD_CONFIG[method] ?? METHOD_CONFIG.GET;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        fontSize: "11px",
        fontWeight: 700,
        backgroundColor: cfg.bg,
        color: cfg.color,
        letterSpacing: "0.05em",
        fontFamily: "var(--font-mono, monospace)",
        whiteSpace: "nowrap",
      }}
    >
      {method}
    </span>
  );
}
