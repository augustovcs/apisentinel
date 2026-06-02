"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import type { HttpMethod, Header } from "@/lib/types";
import { patchUpdateTest, postCreateTest } from "@/app/services/testsService";
import type { ExecutionStatus } from "@/lib/types";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];


interface TestFormProps {
  initialValues?: {
    id: number;
    name: string;
    url: string;
    method: HttpMethod;
    headers: Header[];
    body: string;
    expectedStatusCode: number;
    maxResponseTime: number;
    lastStatus?: ExecutionStatus;
  };
  mode: "create" | "edit";
}

const DEFAULT_VALUES = {
  name: "",
  url: "",
  method: "GET" as HttpMethod,
  headers: [{ key: "", value: "" }],
  body: "",
  expectedStatusCode: 200,
  maxResponseTime: 500,
  lastStatus: "pending" as ExecutionStatus,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "34px",
  padding: "0 12px",
  border: "1px solid #D1D5DB",
  backgroundColor: "#ffffff",
  fontSize: "13px",
  color: "#1C1C1C",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const fieldRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

interface TestPreset {
  label: string;
  description: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Header[];
  body: string;
  expectedStatusCode: number;
  maxResponseTime: number;
}

// Templates prontos para os cenários mais comuns de teste de API externa.
const TEST_PRESETS: TestPreset[] = [
  {
    label: "Public REST (GET)",
    description: "Fetch a public JSON resource",
    name: "Public API - Get Resource",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    headers: [{ key: "Accept", value: "application/json" }],
    body: "",
    expectedStatusCode: 200,
    maxResponseTime: 800,
  },
  {
    label: "Create Resource (POST)",
    description: "POST a JSON payload",
    name: "Public API - Create Resource",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ title: "foo", body: "bar", userId: 1 }, null, 2),
    expectedStatusCode: 201,
    maxResponseTime: 1000,
  },
  {
    label: "Authenticated (Bearer)",
    description: "Request with bearer token",
    name: "Authenticated Endpoint",
    url: "https://api.example.com/v1/me",
    method: "GET",
    headers: [
      { key: "Authorization", value: "Bearer <YOUR_TOKEN>" },
      { key: "Accept", value: "application/json" },
    ],
    body: "",
    expectedStatusCode: 200,
    maxResponseTime: 1000,
  },
  {
    label: "GraphQL Query",
    description: "POST a GraphQL query",
    name: "GraphQL Endpoint",
    url: "https://api.example.com/graphql",
    method: "POST",
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ query: "{ __typename }" }, null, 2),
    expectedStatusCode: 200,
    maxResponseTime: 1200,
  },
  {
    label: "Health Check",
    description: "Fast uptime / ping check",
    name: "Service Health Check",
    url: "https://api.example.com/health",
    method: "GET",
    headers: [],
    body: "",
    expectedStatusCode: 200,
    maxResponseTime: 300,
  },
  {
    label: "Webhook (POST)",
    description: "Send an event payload",
    name: "Outgoing Webhook",
    url: "https://webhook.site/your-unique-id",
    method: "POST",
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ event: "test.event", data: { id: 1 } }, null, 2),
    expectedStatusCode: 200,
    maxResponseTime: 1500,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "#27AE60",
  POST: "#2563EB",
  PUT: "#F59E0B",
  PATCH: "#8B5CF6",
  DELETE: "#DC2626",
  HEAD: "#6B7280",
  OPTIONS: "#6B7280",
};

export default function TestForm({ initialValues, mode }: TestFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const init = initialValues ?? DEFAULT_VALUES;
  const id = initialValues?.id;
  const [name, setName] = useState(init.name);
  const [url, setUrl] = useState(init.url);
  const [method, setMethod] = useState<HttpMethod>(init.method);
  const [headers, setHeaders] = useState<Header[]>(init.headers);
  const [body, setBody] = useState(init.body);
  const [expectedStatusCode, setExpectedStatusCode] = useState(init.expectedStatusCode);
  const [maxResponseTime, setMaxResponseTime] = useState(init.maxResponseTime);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastStatus] = useState<ExecutionStatus>(init.lastStatus ?? "pending");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const applyPreset = (preset: TestPreset) => {
    setName(preset.name);
    setUrl(preset.url);
    setMethod(preset.method);
    setHeaders(preset.headers.length ? preset.headers.map((h) => ({ ...h })) : [{ key: "", value: "" }]);
    setBody(preset.body);
    setExpectedStatusCode(preset.expectedStatusCode);
    setMaxResponseTime(preset.maxResponseTime);
    setErrors({});
    setActivePreset(preset.label);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!url.trim()) e.url = "URL is required.";
    else if (!/^https?:\/\/.+/.test(url.trim())) e.url = "Must be a valid HTTP/HTTPS URL.";
    if (expectedStatusCode < 100 || expectedStatusCode > 599) e.expectedStatusCode = "Must be between 100-599.";
    if (maxResponseTime < 1) e.maxResponseTime = "Must be ≥ 1ms.";
    return e;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) 
      { setErrors(errs); 
        return; 
      }


    // In real app: POST/PUT to API
       try {

        const parsedHeaders = headers.reduce((acc, h) => {

          if (h.key.trim()) {
            acc[h.key] = h.value;
          }

          return acc;

        }, {} as Record<string, string>);

        const payload = {
          name,
          url,
          method,

          headers: parsedHeaders,

          body: body ? JSON.parse(body) : {},

          expectedStatusCode,
          maxResponseTime,
          lastStatus
        };
        
      console.log("initialValues:", initialValues);
      console.log("id:", initialValues?.id);

        if (mode === "edit" && !id) {
         throw new Error("Missing id for update");
            }

        if (mode === "create") {
          await postCreateTest(payload);
        }
        else {
          await patchUpdateTest(id!, payload);
        }

        await queryClient.invalidateQueries({ queryKey: ["tests"] });

        alert(`Test ${mode === "create" ? "created" : "updated"} successfully!`);
        console.log(parsedHeaders);
        
        router.push("/dashboard/tests");

      } catch (error) {

        console.error(error);

        alert("Failed to create test.");

      }
   
  };




  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    const next = [...headers];
    next[i][field] = val;
    setHeaders(next);
  };


  return (
    <div>
      <PageHeader
        title={mode === "create" ? "Create Test" : "Edit Test"}
        subtitle={mode === "create" ? "Configure a new API endpoint test." : "Modify test configuration."}
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/tests")}>
            ← Back to Tests
          </Button>
        }
      />

      {mode === "create" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Quick Start Templates
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "14px" }}>
            Start from a common API test configuration, then tweak the fields below.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
            {TEST_PRESETS.map((preset) => {
              const active = activePreset === preset.label;
              return (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "6px",
                    padding: "12px",
                    border: `1px solid ${active ? "#27AE60" : "#E5E7EB"}`,
                    backgroundColor: active ? "#F0FDF4" : "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#F9FAFB"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#ffffff",
                        backgroundColor: METHOD_COLORS[preset.method] ?? "#6B7280",
                        padding: "2px 6px",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {preset.method}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1C" }}>{preset.label}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#6B7280" }}>{preset.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            padding: "0",
          }}
        >
          {/* Section: Basic */}
          <div style={{ borderBottom: "1px solid #E5E7EB", padding: "16px 20px 4px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Basic Configuration
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "16px", marginBottom: "16px" }}>
              <div style={fieldRowStyle}>
                <label style={labelStyle}>Test Name</label>
                <input
                  style={{ ...inputStyle, borderColor: errors.name ? "#DC2626" : "#D1D5DB" }}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); setActivePreset(null); }}
                  placeholder="e.g. Auth - Login Endpoint"
                />
                {errors.name && <span style={{ fontSize: "11px", color: "#DC2626" }}>{errors.name}</span>}
              </div>
              <div style={fieldRowStyle}>
                <label style={labelStyle}>HTTP Method</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={method}
                  onChange={(e) => { setMethod(e.target.value as HttpMethod); setActivePreset(null); }}
                >
                  {HTTP_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ ...fieldRowStyle, marginBottom: "16px" }}>
              <label style={labelStyle}>URL / Endpoint</label>
              <input
                style={{ ...inputStyle, fontFamily: "monospace", borderColor: errors.url ? "#DC2626" : "#D1D5DB" }}
                value={url}
                onChange={(e) => { setUrl(e.target.value); setErrors({ ...errors, url: "" }); setActivePreset(null); }}
                placeholder="https://api.example.com/v1/resource"
              />
              {errors.url && <span style={{ fontSize: "11px", color: "#DC2626" }}>{errors.url}</span>}
            </div>
          </div>

          {/* Section: Headers */}
          <div style={{ borderBottom: "1px solid #E5E7EB", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Request Headers
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={addHeader}>
                + Add Header
              </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {headers.map((h, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 32px", gap: "8px", alignItems: "center" }}>
                  <input
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: "12px" }}
                    placeholder="Header key"
                    value={h.key}
                    onChange={(e) => updateHeader(i, "key", e.target.value)}
                  />
                  <input
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: "12px" }}
                    placeholder="Header value"
                    value={h.value}
                    onChange={(e) => updateHeader(i, "value", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(i)}
                    style={{
                      width: "32px",
                      height: "34px",
                      border: "1px solid #FCA5A5",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      color: "#DC2626",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FEF2F2"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {headers.length === 0 && (
                <div style={{ fontSize: "12px", color: "#9CA3AF", fontStyle: "italic" }}>No headers configured.</div>
              )}
            </div>
          </div>

          {/* Section: Body */}
          <div style={{ borderBottom: "1px solid #E5E7EB", padding: "16px 20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Request Body (JSON)
            </div>
            <textarea
              style={{
                width: "100%",
                minHeight: "140px",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                backgroundColor: "#F9FAFB",
                fontSize: "12px",
                color: "#1C1C1C",
                fontFamily: "monospace",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#27AE60"; e.target.style.backgroundColor = "#ffffff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#D1D5DB"; e.target.style.backgroundColor = "#F9FAFB"; }}
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Section: Assertions */}
          <div style={{ padding: "16px 20px 20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Assertions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "200px 200px", gap: "16px" }}>
              <div style={fieldRowStyle}>
                <label style={labelStyle}>Expected Status Code</label>
                <input
                  type="number"
                  style={{ ...inputStyle, borderColor: errors.expectedStatusCode ? "#DC2626" : "#D1D5DB" }}
                  value={expectedStatusCode}
                  min={100}
                  max={599}
                  onChange={(e) => { setExpectedStatusCode(Number(e.target.value)); setErrors({ ...errors, expectedStatusCode: "" }); }}
                />
                {errors.expectedStatusCode && <span style={{ fontSize: "11px", color: "#DC2626" }}>{errors.expectedStatusCode}</span>}
              </div>
              <div style={fieldRowStyle}>
                <label style={labelStyle}>Max Response Time (ms)</label>
                <input
                  type="number"
                  style={{ ...inputStyle, borderColor: errors.maxResponseTime ? "#DC2626" : "#D1D5DB" }}
                  value={maxResponseTime}
                  min={1}
                  onChange={(e) => { setMaxResponseTime(Number(e.target.value)); setErrors({ ...errors, maxResponseTime: "" }); }}
                />
                {errors.maxResponseTime && <span style={{ fontSize: "11px", color: "#DC2626" }}>{errors.maxResponseTime}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/tests")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {mode === "create" ? "Create Test" : mode === "edit" ? "Save Changes" : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
