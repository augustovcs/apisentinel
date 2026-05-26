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
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "38px",
          padding: "0 12px",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          outline: "none",
          fontSize: "14px",
          color: "#111827",
          backgroundColor: "#ffffff",
        }}
      />
    </label>
  );
}
