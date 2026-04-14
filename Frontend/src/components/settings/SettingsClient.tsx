"use client";

import PageHeader from "@/components/ui/PageHeader";

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #E5E7EB",
  marginBottom: "20px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  borderBottom: "1px solid #F3F4F6",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#1C1C1C",
};

const descStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#6B7280",
  marginTop: "1px",
};

const inputStyle: React.CSSProperties = {
  height: "32px",
  padding: "0 10px",
  border: "1px solid #D1D5DB",
  backgroundColor: "#ffffff",
  fontSize: "13px",
  color: "#1C1C1C",
  outline: "none",
  width: "280px",
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: "10px 20px",
        backgroundColor: "#F9FAFB",
        borderBottom: "1px solid #E5E7EB",
        fontSize: "11px",
        fontWeight: 700,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {title}
    </div>
  );
}

function HoverBtn({
  children,
  primary,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  const base: React.CSSProperties = primary
    ? { backgroundColor: "#0B3D2E", color: "#ffffff", border: "1px solid #0B3D2E" }
    : { backgroundColor: "#ffffff", color: "#374151", border: "1px solid #D1D5DB" };

  return (
    <button
      onClick={onClick}
      style={{ padding: "7px 18px", fontSize: "13px", fontWeight: 500, cursor: "pointer", ...base }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = primary ? "#145A32" : "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = primary ? "#0B3D2E" : "#ffffff";
      }}
    >
      {children}
    </button>
  );
}

export default function SettingsClient() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Platform configuration and preferences."
      />

      {/* General */}
      <div style={sectionStyle}>
        <SectionTitle title="General" />
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Platform Name</div>
            <div style={descStyle}>Displayed in the sidebar and reports.</div>
          </div>
          <input style={inputStyle} defaultValue="API Sentinel" />
        </div>
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Default Timeout (ms)</div>
            <div style={descStyle}>Maximum response time before a test is marked as timeout.</div>
          </div>
          <input style={inputStyle} type="number" defaultValue={5000} />
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Timezone</div>
            <div style={descStyle}>Used for scheduling and date display.</div>
          </div>
          <select style={{ ...inputStyle, cursor: "pointer" }}>
            <option>UTC</option>
            <option>America/New_York</option>
            <option>America/Sao_Paulo</option>
            <option>Europe/London</option>
            <option>Europe/Berlin</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <SectionTitle title="Notifications" />
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Alert Email</div>
            <div style={descStyle}>Receive alerts on consecutive test failures.</div>
          </div>
          <input style={inputStyle} type="email" placeholder="oncall@company.com" />
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Webhook URL</div>
            <div style={descStyle}>POST failure payloads to a Slack or custom endpoint.</div>
          </div>
          <input style={inputStyle} placeholder="https://hooks.slack.com/..." />
        </div>
      </div>

      {/* API Access */}
      <div style={sectionStyle}>
        <SectionTitle title="API Access" />
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>API Key</div>
            <div style={descStyle}>Use this key to trigger test runs via the REST API.</div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "11px", color: "#6B7280" }}
              defaultValue="sk-sentinel-••••••••••••••••••••••"
              readOnly
            />
            <button
              style={{
                padding: "0 14px",
                height: "32px",
                border: "1px solid #D1D5DB",
                backgroundColor: "transparent",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                color: "#374151",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F3F4F6"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              Regenerate
            </button>
          </div>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Rate Limit</div>
            <div style={descStyle}>Maximum API requests per minute per key.</div>
          </div>
          <input style={inputStyle} type="number" defaultValue={60} />
        </div>
      </div>

      {/* Save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <HoverBtn>Reset to defaults</HoverBtn>
        <HoverBtn primary>Save Settings</HoverBtn>
      </div>
    </div>
  );
}
