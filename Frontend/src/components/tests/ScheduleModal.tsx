"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  toggleSchedule,
  updateSchedule,
} from "@/app/services/schedulesService";
import type { ApiTest, Schedule } from "@/lib/types";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: ApiTest | null;
}

type IntervalType = "seconds" | "minutes" | "hours";

interface FormState {
  name: string;
  description: string;
  intervalValue: number;
  intervalType: IntervalType;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  intervalValue: 1,
  intervalType: "minutes",
  isActive: true,
};

// Pick the largest unit that divides the interval evenly, for a friendlier edit form.
function secondsToForm(seconds: number): { value: number; type: IntervalType } {
  if (seconds % 3600 === 0) return { value: seconds / 3600, type: "hours" };
  if (seconds % 60 === 0) return { value: seconds / 60, type: "minutes" };
  return { value: seconds, type: "seconds" };
}

function formToSeconds(value: number, type: IntervalType): number {
  if (type === "minutes") return value * 60;
  if (type === "hours") return value * 3600;
  return value;
}

function formatInterval(seconds: number): string {
  if (seconds % 3600 === 0 && seconds >= 3600) {
    const h = seconds / 3600;
    return `Every ${h} hour${h > 1 ? "s" : ""}`;
  }
  if (seconds % 60 === 0 && seconds >= 60) {
    const m = seconds / 60;
    return `Every ${m} minute${m > 1 ? "s" : ""}`;
  }
  return `Every ${seconds} second${seconds > 1 ? "s" : ""}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function ScheduleModal({ isOpen, onClose, test }: ScheduleModalProps) {
  const queryClient = useQueryClient();

  // null = list view, "new" = create form, or the schedule being edited
  const [editing, setEditing] = useState<Schedule | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const {
    data: allSchedules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
    enabled: isOpen,
  });

  const schedules = useMemo(
    () => (test ? allSchedules.filter((s) => s.testId === test.id) : []),
    [allSchedules, test]
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["schedules"] });

  const createMutation = useMutation({
    mutationFn: () =>
      createSchedule(
        test!.id,
        formToSeconds(form.intervalValue, form.intervalType),
        form.name || undefined,
        form.description || undefined
      ),
    onSuccess: () => {
      invalidate();
      backToList();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateSchedule(
        (editing as Schedule).id,
        formToSeconds(form.intervalValue, form.intervalType),
        form.isActive,
        form.name || undefined,
        form.description || undefined
      ),
    onSuccess: () => {
      invalidate();
      backToList();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      toggleSchedule(id, isActive),
    onSuccess: invalidate,
  });

  const handleClose = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    onClose();
  };

  const backToList = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setEditing("new");
  };

  const startEdit = (schedule: Schedule) => {
    const { value, type } = secondsToForm(schedule.intervalSeconds);
    setForm({
      name: schedule.name ?? "",
      description: schedule.description ?? "",
      intervalValue: value,
      intervalType: type,
      isActive: schedule.isActive,
    });
    setEditing(schedule);
  };

  if (!isOpen || !test) return null;

  const isFormView = editing !== null;
  const isEditMode = editing !== null && editing !== "new";
  const formMutation = isEditMode ? updateMutation : createMutation;
  const previewSeconds = formToSeconds(form.intervalValue, form.intervalType);

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
          maxWidth: "560px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            {isFormView ? (isEditMode ? "Edit Schedule" : "New Schedule") : "Schedules"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "22px",
              lineHeight: 1,
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 500, color: "#374151" }}>
            Test: <strong>{test.name}</strong>
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
            {test.method} {test.url}
          </p>
        </div>

        {isFormView ? (
          <ScheduleForm
            form={form}
            setForm={setForm}
            isEditMode={isEditMode}
            previewSeconds={previewSeconds}
            isPending={formMutation.isPending}
            isError={formMutation.isError}
            onCancel={backToList}
            onSubmit={() => (isEditMode ? updateMutation.mutate() : createMutation.mutate())}
          />
        ) : (
          <ScheduleList
            schedules={schedules}
            isLoading={isLoading}
            hasError={Boolean(error)}
            onCreate={startCreate}
            onEdit={startEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onToggle={(id, isActive) => toggleMutation.mutate({ id, isActive })}
            deletingId={deleteMutation.isPending ? (deleteMutation.variables as number) : null}
          />
        )}
      </div>
    </div>
  );
}

function ScheduleList({
  schedules,
  isLoading,
  hasError,
  onCreate,
  onEdit,
  onDelete,
  onToggle,
  deletingId,
}: {
  schedules: Schedule[];
  isLoading: boolean;
  hasError: boolean;
  onCreate: () => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, isActive: boolean) => void;
  deletingId: number | null;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <button
          onClick={onCreate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#3B82F6",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#3B82F6"; }}
        >
          + Add Schedule
        </button>
      </div>

      {isLoading ? (
        <p style={{ textAlign: "center", color: "#6B7280", fontSize: "14px", padding: "24px 0" }}>
          Loading schedules...
        </p>
      ) : hasError ? (
        <p style={{ textAlign: "center", color: "#991B1B", fontSize: "14px", padding: "24px 0" }}>
          Failed to load schedules.
        </p>
      ) : schedules.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: "#6B7280",
          fontSize: "14px",
          padding: "32px 0",
          border: "1px dashed #D1D5DB",
          borderRadius: "8px",
        }}>
          No schedules for this test yet.
          <br />
          Click <strong>“+ Add Schedule”</strong> to create one.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                      {schedule.name || `Schedule #${schedule.id}`}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      color: schedule.isActive ? "#166534" : "#6B7280",
                      backgroundColor: schedule.isActive ? "#DCFCE7" : "#F3F4F6",
                    }}>
                      {schedule.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 2px 0", fontSize: "13px", color: "#374151" }}>
                    {formatInterval(schedule.intervalSeconds)}
                  </p>
                  {schedule.description && (
                    <p style={{ margin: "0 0 2px 0", fontSize: "12px", color: "#6B7280" }}>
                      {schedule.description}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF" }}>
                    Last run: {formatDate(schedule.lastExecutedAt)} · Next: {formatDate(schedule.nextExecutionAt)}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                <SmallBtn
                  color={schedule.isActive ? "#B45309" : "#166534"}
                  borderColor={schedule.isActive ? "#FCD34D" : "#86EFAC"}
                  hoverBg={schedule.isActive ? "#FFFBEB" : "#F0FDF4"}
                  onClick={() => onToggle(schedule.id, !schedule.isActive)}
                >
                  {schedule.isActive ? "Pause" : "Resume"}
                </SmallBtn>
                <SmallBtn
                  color="#374151"
                  borderColor="#D1D5DB"
                  hoverBg="#F3F4F6"
                  onClick={() => onEdit(schedule)}
                >
                  Edit
                </SmallBtn>
                <SmallBtn
                  color="#DC2626"
                  borderColor="#FCA5A5"
                  hoverBg="#FEF2F2"
                  onClick={() => {
                    if (confirm("Delete this schedule?")) onDelete(schedule.id);
                  }}
                  disabled={deletingId === schedule.id}
                >
                  {deletingId === schedule.id ? "Deleting..." : "Delete"}
                </SmallBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleForm({
  form,
  setForm,
  isEditMode,
  previewSeconds,
  isPending,
  isError,
  onCancel,
  onSubmit,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  isEditMode: boolean;
  previewSeconds: number;
  isPending: boolean;
  isError: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 500,
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Schedule Name (optional)</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Daily Health Check"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Add notes about this schedule..."
          rows={3}
          style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Interval</label>
          <input
            type="number"
            value={form.intervalValue}
            onChange={(e) =>
              setForm((f) => ({ ...f, intervalValue: Math.max(1, parseInt(e.target.value) || 1) }))
            }
            min="1"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select
            value={form.intervalType}
            onChange={(e) => setForm((f) => ({ ...f, intervalType: e.target.value as IntervalType }))}
            style={inputStyle}
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>

      {isEditMode && (
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "14px", color: "#374151" }}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          Active
        </label>
      )}

      <div style={{
        backgroundColor: "#F3F4F6",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "13px",
        color: "#374151",
      }}>
        <strong>Frequency:</strong> Every {form.intervalValue} {form.intervalType}
        <br />
        <strong>Duration:</strong> {previewSeconds} seconds
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "8px 16px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            backgroundColor: "white",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F9FAFB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isPending}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: isPending ? "#D1D5DB" : "#3B82F6",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!isPending) e.currentTarget.style.backgroundColor = "#2563EB"; }}
          onMouseLeave={(e) => { if (!isPending) e.currentTarget.style.backgroundColor = "#3B82F6"; }}
        >
          {isPending
            ? isEditMode ? "Saving..." : "Creating..."
            : isEditMode ? "Save Changes" : "Create Schedule"}
        </button>
      </div>

      {isError && (
        <div style={{
          marginTop: "12px",
          padding: "12px",
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
          borderRadius: "6px",
          fontSize: "13px",
        }}>
          {isEditMode ? "Failed to update schedule." : "Failed to create schedule."} Please try again.
        </div>
      )}
    </div>
  );
}

function SmallBtn({
  children,
  color,
  borderColor,
  hoverBg,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  color: string;
  borderColor: string;
  hoverBg: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "4px 12px",
        fontSize: "11px",
        fontWeight: 500,
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        backgroundColor: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        color,
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >
      {children}
    </button>
  );
}
