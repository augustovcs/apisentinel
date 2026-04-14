export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type ExecutionStatus = "success" | "failed" | "timeout" | "pending";

export interface Header {
  key: string;
  value: string;
}

export interface ApiTest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Header[];
  body: string;
  expectedStatusCode: number;
  maxResponseTime: number; // ms
  lastStatus: ExecutionStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface Execution {
  id: string;
  testId: string;
  testName: string;
  status: ExecutionStatus;
  responseTime: number; // ms
  statusCode: number | null;
  error: string | null;
  executedAt: string;
}

export interface DashboardStats {
  totalTests: number;
  successRate: number;
  failedLast24h: number;
  avgResponseTime: number;
}
