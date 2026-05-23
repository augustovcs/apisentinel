"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mockTests } from "@/lib/mock-data";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import MethodBadge from "@/components/ui/MethodBadge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { deleteTests, getTests } from "@/app/services/testsService";
import type { ApiTest } from "@/lib/types";
import {QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportWebVitals } from "next/dist/build/templates/pages";

export default function TestsClient() {
  const {
    data: tests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: getTests,

    // 1 minutos sem refetch
    staleTime: 1000 * 60 * 1,
  });

  const queryClient = useQueryClient();


  const deleteMutation = useMutation({
    mutationFn: deleteTests,
    onSuccess: () =>  {
      queryClient.invalidateQueries({
        queryKey: ["tests"]
      })

    }
  })

  if (isLoading) {
    return <div>Loading tests...</div>;
  }

  if (error) {
    return <div>Failed to load tests.</div>;
  }

  return (
    <div>
      <PageHeader
        title="Tests"
        subtitle={`${tests.length} configured API tests`}
        actions={
          <Link href="/dashboard/tests/new" style={{ textDecoration: "none" }}>
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

      <DataTable<ApiTest>
        columns={[
          {
            key: "name",
            header: "Name",
            render: (val, row) => (



              
              <Link
                href={`/dashboard/tests/${row.id}/edit`}
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
            render: (val) => <ActionButtons id={val as number} onDelete={() => deleteMutation.mutate(Number(val))}/>,
          },
        ]}
        //tests = dev mockTests = mock view
        data={tests}
        emptyMessage="No tests configured. Create your first test."
      />
    </div>
  );
}



function ActionButtons({ id, onDelete, }: { id: number, onDelete: () => void; }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <Link href={`/dashboard/tests/${id}/edit`} style={{ textDecoration: "none" }}>
        <ActionBtn color="#374151" borderColor="#D1D5DB" hoverBg="#F3F4F6">Edit</ActionBtn>
      </Link>
      <ActionBtn color="#27AE60" borderColor="#27AE60" hoverBg="#F0FDF4">Run</ActionBtn>
      <ActionBtn color="#DC2626" borderColor="#FCA5A5" hoverBg="#FEF2F2" onClick={onDelete}>Delete</ActionBtn>
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
