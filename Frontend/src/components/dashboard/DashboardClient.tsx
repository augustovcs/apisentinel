"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import { getDashboardMain } from "@/app/services/pagesService";
import type { DashboardMain, DashboardExecution, ExecutionStatus } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


export default function DashboardClient() {
  const { data: dashboard, isLoading, error } = useQuery<DashboardMain>({
    queryKey: ["dashboardMain"],
    queryFn: getDashboardMain,
    staleTime: 1000 * 60,
  });

  const totalTests = dashboard?.totalTests ?? 0;
  const successRate = dashboard?.successRate ?? 0;
  const failedCount = dashboard?.failedTests ?? 0;
  const avgResponseTime = dashboard?.avgResponseTime ?? 0;

  const recentExecutions = (dashboard?.recentExecutions ?? [])
    .slice()
    .map((e: DashboardExecution) => ({
      testName: e.testName ?? "",
      status: e.status ?? "pending",
      statusCode: e.statusCode,
      responseTime: e.responseTime,
      executedAt: e.executedAt ?? new Date().toISOString(),
    }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items justify-center pb-30">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load dashboard data.</div>;
  }

  return (
    <div>
      
      <PageHeader
      
        title="Dashboard"
        subtitle="System-wide overview of API test health and recent executions."
      />
      {/* loading spinner removed from here; handled in loading state */}


      {/* Stat cards */}
      <div
        
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          label="Total Tests"
          value={totalTests}
          accent="#0B3D2E"
          trend={{ direction: "up", label: "Uses current test data" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
          }
        />
        <StatCard
          label="Success Rate"
          value={successRate}
          unit="%"
          accent="#27AE60"
          trend={{ direction: "neutral", label: "Based on current tests" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatCard
          label="Failed Tests"
          value={failedCount}
          accent="#DC2626"
          trend={{ direction: "up", label: "Current failed count" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
        />
        <StatCard
          label="Avg Response Time"
          value={avgResponseTime}
          unit="ms"
          accent="#145A32"
          trend={{ direction: "neutral", label: "Based on test targets" }}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      {/* Recent Executions */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1C1C1C", margin: 0 }}>
            Recent Executions
          </h2>
          <Link
            href="/dashboard/executions"
            style={{ fontSize: "12px", color: "#27AE60", textDecoration: "none", fontWeight: 500 }}
          >
            View all →
          </Link>
        </div>

        <DataTable<Record<string, unknown>>
          columns={[
            {
              key: "testName",
              header: "Test Name",
              render: (val) => (
                <span style={{ fontWeight: 500 }}>{val as string}</span>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: "120px",
              render: (val) => <StatusBadge status={val as ExecutionStatus} />,
            },
            {
              key: "statusCode",
              header: "HTTP",
              width: "80px",
              align: "center",
              render: (val) => (
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: val ? "#1C1C1C" : "#9CA3AF" }}>
                  
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
              key: "executedAt",
              header: "Executed At",
              width: "160px",
              render: (val) => (
                <span style={{ color: "#6B7280", fontSize: "12px" }}>{formatDate(val as string)}</span>
              ),
            },
          ]}
          data={recentExecutions as unknown as Record<string, unknown>[]}
          emptyMessage="No executions found."
        />
      </div>
    </div>
  );
}
