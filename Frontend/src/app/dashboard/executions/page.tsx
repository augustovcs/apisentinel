"use client";

import { useState, useMemo } from "react";
import { mockExecutions } from "@/lib/mock-data";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import type { ExecutionStatus, Execution } from "@/lib/types";

const STATUS_OPTIONS: { value: ExecutionStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "timeout", label: "Timeout" },
  { value: "pending", label: "Pending" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const selectStyle: React.CSSProperties = {
  height: "32px",
  padding: "0 10px",
  border: "1px solid #D1D5DB",
  backgroundColor: "#ffffff",
  fontSize: "13px",
  color: "#1C1C1C",
  cursor: "pointer",
  outline: "none",
};

export default function ExecutionsPage() {
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockExecutions.filter((ex) => {
      if (statusFilter !== "all" && ex.status !== statusFilter) return false;
      if (search && !ex.testName.toLowerCase().includes(search.toLowerCase())) return false;
      const ts = new Date(ex.executedAt).getTime();
      if (dateFrom && ts < new Date(dateFrom).getTime()) return false;
      if (dateTo && ts > new Date(dateTo + "T23:59:59").getTime()) return false;
      return true;
    });
  }, [statusFilter, dateFrom, dateTo, search]);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const hasFilters = statusFilter !== "all" || dateFrom || dateTo || search;

  return (
    <div>
      <PageHeader
        title="Executions"
        subtitle={`${filtered.length} of ${mockExecutions.length} executions`}
      />

      {/* Filters bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E5E7EB",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            style={{ ...selectStyle, width: "200px", paddingLeft: "28px" }}
            placeholder="Search test name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          style={selectStyle}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ExecutionStatus | "all")}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#6B7280" }}>From</label>
          <input
            type="date"
            style={selectStyle}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "12px", color: "#6B7280" }}>To</label>
          <input
            type="date"
            style={selectStyle}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              fontSize: "12px",
              color: "#6B7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 4px",
              textDecoration: "underline",
            }}
          >
            Clear filters
          </button>
        )}

        {/* Status summary chips */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {(["success", "failed", "timeout"] as ExecutionStatus[]).map((s) => {
            const count = mockExecutions.filter((e) => e.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                style={{
                  padding: "3px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: `1px solid ${statusFilter === s ? "#0B3D2E" : "#E5E7EB"}`,
                  backgroundColor: statusFilter === s ? "#0B3D2E" : "transparent",
                  color: statusFilter === s ? "#ffffff" : "#6B7280",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                {s.toUpperCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <DataTable<Record<string, unknown>>
        columns={[
          {
            key: "testName",
            header: "Test Name",
            render: (val) => <span style={{ fontWeight: 500 }}>{val as string}</span>,
          },
          {
            key: "status",
            header: "Status",
            width: "120px",
            render: (val) => <StatusBadge status={val as Execution["status"]} />,
          },
          {
            key: "statusCode",
            header: "HTTP Code",
            width: "100px",
            align: "center",
            render: (val) => (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color:
                    !val ? "#9CA3AF"
                    : (val as number) >= 500 ? "#DC2626"
                    : (val as number) >= 400 ? "#D97706"
                    : "#166534",
                }}
              >
                {val ?? "—"}
              </span>
            ),
          },
          {
            key: "responseTime",
            header: "Response Time",
            width: "130px",
            align: "right",
            render: (val) => (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: (val as number) > 1000 ? "#DC2626" : (val as number) > 500 ? "#D97706" : "#166534",
                }}
              >
                {val as number}ms
              </span>
            ),
          },
          {
            key: "error",
            header: "Error",
            render: (val) =>
              val ? (
                <span style={{ fontSize: "12px", color: "#991B1B", fontFamily: "monospace" }}>
                  {val as string}
                </span>
              ) : (
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>—</span>
              ),
          },
          {
            key: "executedAt",
            header: "Executed At",
            width: "170px",
            render: (val) => (
              <span style={{ color: "#6B7280", fontSize: "12px" }}>{formatDate(val as string)}</span>
            ),
          },
        ]}
        data={filtered as unknown as Record<string, unknown>[]}
        emptyMessage="No executions match the current filters."
      />
    </div>
  );
}
