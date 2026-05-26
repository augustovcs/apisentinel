"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExecutions, getExecutionById } from "@/app/services/executionsService";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import type { ExecutionStatus, Execution, ExecutionDetail } from "@/lib/types";

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
  const { data: executions = [], isLoading, error } = useQuery({
    queryKey: ["executions"],
    queryFn: getExecutions,
    staleTime: 1000 * 60 * 1,
  });

  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(null);

  const { data: selectedExecution, isLoading: isLoadingExecution, error: executionError } = useQuery<ExecutionDetail | undefined>({
    queryKey: ["execution", selectedExecutionId],
    queryFn: () => getExecutionById(selectedExecutionId!),
    enabled: selectedExecutionId !== null,
    staleTime: 1000 * 10,
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return executions.filter((ex) => {
      if (statusFilter !== "all" && ex.status !== statusFilter) return false;
      if (query) {
        const status = ex.status?.toLowerCase() ?? "";
        const testName = ex.testName?.toLowerCase() ?? "";
        const statusCode = ex.statusCode != null ? String(ex.statusCode) : "";
        if (!testName.includes(query) && !status.includes(query) && !statusCode.includes(query)) return false;
      }
      const ts = new Date(ex.executedAt).getTime();
      if (dateFrom && ts < new Date(dateFrom).getTime()) return false;
      if (dateTo && ts > new Date(dateTo + "T23:59:59").getTime()) return false;
      return true;
    });
  }, [statusFilter, dateFrom, dateTo, search, executions]);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const hasFilters = statusFilter !== "all" || dateFrom || dateTo || search;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items justify-center pb-30">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load executions.</div>;
  }

  return (
    <div>
      <PageHeader
        title="Executions"
        subtitle={`${filtered.length} of ${executions.length} executions`}
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
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search test name..."
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
            const count = executions.filter((e) => e.status === s).length;
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

      {selectedExecutionId !== null && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "16px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Execution details</h2>
              <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: "13px" }}>
                Click another row or close this panel to view a different execution.
              </p>
            </div>
            <button
              onClick={() => setSelectedExecutionId(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "#374151",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Close
            </button>
          </div>

          {isLoadingExecution ? (
            <div style={{ color: "#374151", fontSize: "13px" }}>Loading execution details...</div>
          ) : executionError ? (
            <div style={{ color: "#DC2626", fontSize: "13px" }}>Unable to load details.</div>
          ) : selectedExecution ? (
            <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <div style={{ padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Test</div>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>{selectedExecution.testName}</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>{selectedExecution.method ?? "—"} {selectedExecution.url ?? "—"}</div>
              </div>

              <div style={{ padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Status</div>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>{selectedExecution.status}</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>HTTP {selectedExecution.statusCode ?? "—"}</div>
              </div>

              <div style={{ padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Performance</div>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>{selectedExecution.responseTime}ms</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>Executed at {formatDate(selectedExecution.executedAt)}</div>
              </div>

              <div style={{ padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Test expectations</div>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>Expected {selectedExecution.expectedStatusCode ?? "—"}</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>Max RT {selectedExecution.maxResponseTime ?? "—"}ms</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>Last test status: {selectedExecution.testLastStatus ?? "—"}</div>
              </div>

              <div style={{ gridColumn: "1 / -1", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Request details</div>
                <pre style={{ margin: 0, overflowX: "auto", fontSize: "12px", color: "#1F2937", background: "#F9FAFB", padding: "10px", borderRadius: "8px" }}>
                  {selectedExecution.headers ? JSON.stringify(selectedExecution.headers, null, 2) : "No headers provided."}
                </pre>
              </div>

              <div style={{ gridColumn: "1 / -1", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>Body payload</div>
                <pre style={{ margin: 0, overflowX: "auto", fontSize: "12px", color: "#1F2937", background: "#F9FAFB", padding: "10px", borderRadius: "8px" }}>
                  {selectedExecution.body ? JSON.stringify(selectedExecution.body, null, 2) : "No request body."}
                </pre>
              </div>

              {selectedExecution.error && (
                <div style={{ gridColumn: "1 / -1", padding: "12px", border: "1px solid #FECACA", borderRadius: "10px", background: "#FEF2F2", color: "#991B1B" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>Error details</div>
                  <div style={{ fontSize: "12px" }}>{selectedExecution.error}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#6B7280", fontSize: "13px" }}>Select an execution row to inspect the full request and response details.</div>
          )}
        </div>
      )}

      <DataTable<Record<string, unknown>>
        onRowClick={(row) => setSelectedExecutionId(Number(row.id as string))}
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
                {val != null ? String(val) : "—"}
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
