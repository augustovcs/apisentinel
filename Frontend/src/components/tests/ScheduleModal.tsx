"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule } from "@/app/services/schedulesService";
import type { ApiTest } from "@/lib/types";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: ApiTest | null;
}

export default function ScheduleModal({ isOpen, onClose, test }: ScheduleModalProps) {
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");
  const [intervalType, setIntervalType] = useState<"seconds" | "minutes" | "hours">("minutes");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => {
      let seconds = intervalSeconds;
      if (intervalType === "minutes") seconds = intervalSeconds * 60;
      if (intervalType === "hours") seconds = intervalSeconds * 3600;

      return createSchedule(test!.id, seconds, scheduleName, scheduleDescription);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      handleClose();
    },
  });

  const handleClose = () => {
    setIntervalSeconds(60);
    setScheduleName("");
    setScheduleDescription("");
    setIntervalType("minutes");
    onClose();
  };

  if (!isOpen || !test) return null;

  const convertedInterval = () => {
    if (intervalType === "seconds") return intervalSeconds;
    if (intervalType === "minutes") return intervalSeconds * 60;
    if (intervalType === "hours") return intervalSeconds * 3600;
    return intervalSeconds;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.5rem", fontWeight: 700 }}>
          Schedule Execution
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Test: <strong>{test.name}</strong>
          </p>
          <p style={{ margin: "0", fontSize: "12px", color: "#6B7280" }}>
            {test.method} {test.url}
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>
            Schedule Name (optional)
          </label>
          <input
            type="text"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            placeholder="e.g. Daily Health Check"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>
            Description (optional)
          </label>
          <textarea
            value={scheduleDescription}
            onChange={(e) => setScheduleDescription(e.target.value)}
            placeholder="Add notes about this schedule..."
            rows={3}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>
              Interval
            </label>
            <input
              type="number"
              value={intervalSeconds}
              onChange={(e) => setIntervalSeconds(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500 }}>
              Type
            </label>
            <select
              value={intervalType}
              onChange={(e) => setIntervalType(e.target.value as any)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        </div>

        <div style={{
          backgroundColor: "#F3F4F6",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "16px",
          fontSize: "13px",
          color: "#374151",
        }}>
          <strong>Frequency:</strong> Every {intervalSeconds} {intervalType}
          <br />
          <strong>Duration:</strong> {convertedInterval()} seconds
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              backgroundColor: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: createMutation.isPending ? "#D1D5DB" : "#3B82F6",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: createMutation.isPending ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!createMutation.isPending) {
                e.currentTarget.style.backgroundColor = "#2563EB";
              }
            }}
            onMouseLeave={(e) => {
              if (!createMutation.isPending) {
                e.currentTarget.style.backgroundColor = "#3B82F6";
              }
            }}
          >
            {createMutation.isPending ? "Creating..." : "Create Schedule"}
          </button>
        </div>

        {createMutation.isError && (
          <div style={{
            marginTop: "12px",
            padding: "12px",
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "6px",
            fontSize: "13px",
          }}>
            Failed to create schedule. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
