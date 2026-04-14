"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0B3D2E",
    color: "#ffffff",
    border: "1px solid #0B3D2E",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#1C1C1C",
    border: "1px solid #D1D5DB",
  },
  danger: {
    backgroundColor: "#DC2626",
    color: "#ffffff",
    border: "1px solid #DC2626",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#6B7280",
    border: "1px solid transparent",
  },
};

const HOVER_STYLES: Record<string, Partial<React.CSSProperties>> = {
  primary: { backgroundColor: "#145A32", borderColor: "#145A32" },
  secondary: { backgroundColor: "#F9FAFB", borderColor: "#9CA3AF" },
  danger: { backgroundColor: "#B91C1C", borderColor: "#B91C1C" },
  ghost: { backgroundColor: "#F3F4F6", color: "#374151" },
};

export default function Button({ variant = "primary", size = "md", children, style, onMouseEnter, onMouseLeave, disabled, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: size === "sm" ? "5px 12px" : "7px 16px",
    fontSize: size === "sm" ? "12px" : "13px",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background-color 0.12s, border-color 0.12s",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    ...VARIANT_STYLES[variant],
    ...style,
  };

  return (
    <button
      disabled={disabled}
      style={base}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hov = HOVER_STYLES[variant];
          Object.assign((e.currentTarget as HTMLElement).style, hov);
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const def = VARIANT_STYLES[variant];
        Object.assign((e.currentTarget as HTMLElement).style, def);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
