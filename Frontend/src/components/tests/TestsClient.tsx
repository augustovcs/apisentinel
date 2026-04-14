"use client";

import Link from "next/link";
import { mockTests } from "@/lib/mock-data";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import MethodBadge from "@/components/ui/MethodBadge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import type { ApiTest } from "@/lib/types";

export default function TestsClient() {
  return (
    <div>
      <PageHeader
        title="Tests"
        subtitle={`${mockTests.length} configured API tests`}
        actions={
          <Link href="/tests/new" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Test
            </Button>
          </Link>
        }
      />

      <DataTable<Record<string, unknown>>
        columns={[
          {
            key: "name",
            header: "Name",
            render: (val, row) => (
              <Link
                href={`/tests/${(row as unknown as ApiTest).id}/edit`}
                style={{ color: "#0B3D2E", fontWeight: 500, textDecoration: "none" }}
              >
                {val as string}
              </Link>
            ),
          },
          {
            key: "method",
            header: "Method",
            width: "90px",
            render: (val) => <MethodBadge method={val as ApiTest["method"]} />,
          },
          {
            key: "url",
            header: "Endpoint",
            render: (val) => (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "#374151",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "380px",
                }}
              >
                {val as string}
              </span>
            ),
          },
          {
            key: "expectedStatusCode",
            header: "Expected",
            width: "90px",
            align: "center",
            render: (val) => (
              <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>
                {val as number}
              </span>
            ),
          },
          {
            key: "maxResponseTime",
            header: "Max RT",
            width: "90px",
            align: "right",
            render: (val) => (
              <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>
                {val as number}ms
              </span>
            ),
          },
          {
            key: "lastStatus",
            header: "Last Status",
            width: "120px",
            render: (val) => <StatusBadge status={val as ApiTest["lastStatus"]} />,
          },
          {
            key: "id",
            header: "Actions",
            width: "170px",
            render: (val) => <ActionButtons id={val as string} />,
          },
        ]}
        data={mockTests as unknown as Record<string, unknown>[]}
        emptyMessage="No tests configured. Create your first test."
      />
    </div>
  );
}

function ActionButtons({ id }: { id: string }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <Link href={`/tests/${id}/edit`} style={{ textDecoration: "none" }}>
        <ActionBtn color="#374151" borderColor="#D1D5DB" hoverBg="#F3F4F6">Edit</ActionBtn>
      </Link>
      <ActionBtn color="#27AE60" borderColor="#27AE60" hoverBg="#F0FDF4">Run</ActionBtn>
      <ActionBtn color="#DC2626" borderColor="#FCA5A5" hoverBg="#FEF2F2">Delete</ActionBtn>
    </div>
  );
}

function ActionBtn({
  children,
  color,
  borderColor,
  hoverBg,
  onClick,
}: {
  children: React.ReactNode;
  color: string;
  borderColor: string;
  hoverBg: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        fontSize: "11px",
        fontWeight: 500,
        border: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
        cursor: "pointer",
        color,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >
      {children}
    </button>
  );
}
