"use client";

import { useState } from "react";

export default function Topbar() {
  const [search, setSearch] = useState("");

  return (
    <header
      style={{
        height: "52px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", width: "300px" }}>
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9CA3AF",
            pointerEvents: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search tests, executions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            height: "32px",
            paddingLeft: "32px",
            paddingRight: "12px",
            border: "1px solid #D1D5DB",
            backgroundColor: "#F9FAFB",
            fontSize: "13px",
            color: "#1C1C1C",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#27AE60";
            e.target.style.backgroundColor = "#ffffff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#D1D5DB";
            e.target.style.backgroundColor = "#F9FAFB";
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6B7280" }}>
          <div style={{ width: "7px", height: "7px", backgroundColor: "#27AE60", borderRadius: "50%" }} />
          All systems operational
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", backgroundColor: "#E5E7EB" }} />

        {/* User avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "4px 8px",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
            (e.currentTarget as HTMLElement).style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#0B3D2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            AE
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#1C1C1C", lineHeight: 1.3 }}>A. Engineer</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.2 }}>admin</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="square">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
