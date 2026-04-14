"use client";

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "10px 16px",
                    textAlign: col.align || "left",
                    fontWeight: 600,
                    fontSize: "11px",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    width: col.width,
                    borderRight: "1px solid #F3F4F6",
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "#9CA3AF",
                    fontSize: "13px",
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    borderBottom: idx < data.length - 1 ? "1px solid #F3F4F6" : "none",
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (onRowClick) (e.currentTarget as HTMLElement).style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "11px 16px",
                        textAlign: col.align || "left",
                        color: "#1C1C1C",
                        verticalAlign: "middle",
                        borderRight: "1px solid #F3F4F6",
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
