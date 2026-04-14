"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import type { HttpMethod, Header } from "@/lib/types";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

interface TestFormProps {
  initialValues?: {
    name: string;
    url: string;
    method: HttpMethod;
    headers: Header[];
    body: string;
    expectedStatusCode: number;
    maxResponseTime: number;
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

export default function TestForm({ initialValues, mode }: TestFormProps) {
  const router = useRouter();
  const init = initialValues ?? DEFAULT_VALUES;

  const [name, setName] = useState(init.name);
  const [url, setUrl] = useState(init.url);
  const [method, setMethod] = useState<HttpMethod>(init.method);
  const [headers, setHeaders] = useState<Header[]>(init.headers);
  const [body, setBody] = useState(init.body);
  const [expectedStatusCode, setExpectedStatusCode] = useState(init.expectedStatusCode);
  const [maxResponseTime, setMaxResponseTime] = useState(init.maxResponseTime);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!url.trim()) e.url = "URL is required.";
    else if (!/^https?:\/\/.+/.test(url.trim())) e.url = "Must be a valid HTTP/HTTPS URL.";
    if (expectedStatusCode < 100 || expectedStatusCode > 599) e.expectedStatusCode = "Must be between 100–599.";
    if (maxResponseTime < 1) e.maxResponseTime = "Must be ≥ 1ms.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // In real app: POST/PUT to API
    alert(`Test ${mode === "create" ? "created" : "updated"} successfully! (demo)`);
    router.push("/tests");
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
          <Button variant="secondary" size="sm" onClick={() => router.push("/tests")}>
            ← Back to Tests
          </Button>
        }
      />

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
                  onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
                  placeholder="e.g. Auth - Login Endpoint"
                />
                {errors.name && <span style={{ fontSize: "11px", color: "#DC2626" }}>{errors.name}</span>}
              </div>
              <div style={fieldRowStyle}>
                <label style={labelStyle}>HTTP Method</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
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
                onChange={(e) => { setUrl(e.target.value); setErrors({ ...errors, url: "" }); }}
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
          <Button type="button" variant="secondary" onClick={() => router.push("/tests")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {mode === "create" ? "Create Test" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
