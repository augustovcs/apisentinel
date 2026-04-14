interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1C1C1C",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6B7280" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{actions}</div>}
    </div>
  );
}
