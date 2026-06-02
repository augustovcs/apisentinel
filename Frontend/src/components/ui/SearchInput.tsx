"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search...", label }: SearchInputProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", maxWidth: "420px" }}>
      {label ? <span style={{ fontSize: "12px", color: "#6B7280" }}>{label}</span> : null}
      <div style={{ position: "relative", width: "100%" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none", display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: "38px",
            padding: "0 12px 0 34px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#111827",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
          }}
        />
      </div>
    </label>
  );
}
