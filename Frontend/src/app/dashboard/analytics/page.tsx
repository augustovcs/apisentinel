"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsData } from "@/app/services/logsService";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import type { AnalyticsData, ExecutionLog } from "@/lib/types";

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

type TabType = "overview" | "executions" | "tests" | "trends";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
    staleTime: 1000 * 60 * 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items justify-center pb-30">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load analytics data.</div>;
  }

  if (!analytics) {
    return <div>No analytics data available.</div>;
  }

  const tabStyle = (tab: TabType) => ({
    padding: "10px 16px",
    border: "none",
    backgroundColor: activeTab === tab ? "#0B3D2E" : "#F3F4F6",
    color: activeTab === tab ? "white" : "#374151",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    borderRadius: activeTab === tab ? "6px 6px 0 0" : "6px",
    transition: "all 0.2s",
  });

  const statBoxStyle = (color: string) => ({
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: color,
    color: "white",
    textAlign: "center" as const,
  });

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Comprehensive execution metrics and insights"
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #E5E7EB" }}>
        <button style={tabStyle("overview")} onClick={() => setActiveTab("overview")}>
          Overview
        </button>
        <button style={tabStyle("executions")} onClick={() => setActiveTab("executions")}>
          Executions
        </button>
        <button style={tabStyle("tests")} onClick={() => setActiveTab("tests")}>
          Tests
        </button>
        <button style={tabStyle("trends")} onClick={() => setActiveTab("trends")}>
          Trends
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            <div style={statBoxStyle("#3B82F6")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {analytics.summary.totalExecutions}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Total Executions</div>
            </div>

            <div style={statBoxStyle("#10B981")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {Math.round(analytics.summary.successRate)}%
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Success Rate</div>
            </div>

            <div style={statBoxStyle("#F59E0B")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {analytics.summary.successfulExecutions}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Successful</div>
            </div>

            <div style={statBoxStyle("#EF4444")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {analytics.summary.failedExecutions}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Failed</div>
            </div>

            <div style={statBoxStyle("#8B5CF6")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {Math.round(analytics.summary.averageResponseTime)}ms
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Avg Response Time</div>
            </div>

            <div style={statBoxStyle("#6B7280")}>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>
                {analytics.summary.processingExecutions}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>Processing</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Execution Status Pie */}
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600 }}>Executions by Status</h3>
              <div>
                {Object.entries(analytics.executionsByStatus).map(([status, count]) => (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor:
                          status === "success"
                            ? "#10B981"
                            : status === "failed"
                            ? "#EF4444"
                            : status === "processing"
                            ? "#F59E0B"
                            : "#6B7280",
                      }}
                    />
                    <span style={{ fontSize: "12px", flex: 1, textTransform: "capitalize" }}>{status}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Distribution */}
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600 }}>Top Tests</h3>
              <div>
                {Object.entries(analytics.executionsByTest)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([testName, count]) => (
                    <div key={testName} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {testName}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#3B82F6" }}>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Executions Tab */}
      {activeTab === "executions" && (
        <div>
          <DataTable<ExecutionLog>
            columns={[
              {
                key: "testName",
                header: "Test",
                render: (val) => <span style={{ fontWeight: 500 }}>{val as string}</span>,
              },
              {
                key: "method",
                header: "Method",
                width: "80px",
                render: (val) => (
                  <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "#0B3D2E" }}>
                    {val as string}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                width: "100px",
                render: (val) => {
                  const status = val as string;
                  const colors: Record<string, string> = {
                    success: "#10B981",
                    failed: "#EF4444",
                    processing: "#F59E0B",
                    timeout: "#8B5CF6",
                  };
                  return (
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: (colors[status] || "#6B7280") + "22",
                        color: colors[status] || "#6B7280",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </span>
                  );
                },
              },
              {
                key: "responseTime",
                header: "Response Time",
                width: "120px",
                align: "right",
                render: (val) => (
                  <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>
                    {val ? `${val}ms` : "—"}
                  </span>
                ),
              },
              {
                key: "statusCode",
                header: "Status Code",
                width: "100px",
                align: "center",
                render: (val) => (
                  <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600 }}>
                    {val ?? "—"}
                  </span>
                ),
              },
              {
                key: "createdAt",
                header: "Date",
                width: "160px",
                render: (val) => <span style={{ fontSize: "12px", color: "#6B7280" }}>{formatDate(val as string)}</span>,
              },
            ]}
            data={analytics.recentExecutions}
            emptyMessage="No executions found."
          />
        </div>
      )}

      {/* Tests Tab */}
      {activeTab === "tests" && (
        <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600 }}>Execution Count by Test</h3>
          <div>
            {Object.entries(analytics.executionsByTest)
              .sort((a, b) => b[1] - a[1])
              .map(([testName, count]) => (
                <div key={testName} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                  <span style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>{testName}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        height: "24px",
                        width: `${Math.min((count / Math.max(...Object.values(analytics.executionsByTest))) * 200, 200)}px`,
                        backgroundColor: "#3B82F6",
                        borderRadius: "4px",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 600, minWidth: "40px", textAlign: "right" }}>{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === "trends" && (
        <div>
          <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB", overflowX: "auto" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600 }}>Execution Trends (Last 30 Days)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ padding: "8px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#374151" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#374151" }}>Success</th>
                  <th style={{ padding: "8px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#374151" }}>Failed</th>
                  <th style={{ padding: "8px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#374151" }}>Avg Response Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.executionTrend.map((trend) => (
                  <tr key={trend.date} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px", fontSize: "12px" }}>{new Date(trend.date).toLocaleDateString()}</td>
                    <td style={{ padding: "8px", textAlign: "right", fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
                      {trend.successCount}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", fontSize: "12px", color: "#EF4444", fontWeight: 600 }}>
                      {trend.failedCount}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", fontSize: "12px", color: "#6B7280" }}>
                      {Math.round(trend.averageResponseTime)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
