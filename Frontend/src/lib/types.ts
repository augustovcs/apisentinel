export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type ExecutionStatus = "success" | "failed" | "timeout" | "pending";

export interface Header {
  key: string;
  value: string;
}

export interface ApiTest {
  id: number;
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

export interface CreateTestType {
    name: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body: unknown;
    expectedStatusCode: number;
    maxResponseTime: number;
    lastStatus?: ExecutionStatus;
}

export interface DashboardExecution {
  testName?: string;
  status?: ExecutionStatus | "pending";
  statusCode?: number | null;
  responseTime?: number | null;
  executedAt?: string | null;
}

export interface DashboardMain {
  totalTests: number;
  successRate: number;
  failedTests: number;
  avgResponseTime: number;
  recentExecutions: DashboardExecution[];
}
