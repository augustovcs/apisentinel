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

export interface ExecutionDetail extends Execution {
  url: string | null;
  method: string | null;
  headers: Record<string, unknown> | null;
  body: Record<string, unknown> | null;
  expectedStatusCode: number | null;
  maxResponseTime: number | null;
  testLastStatus: ExecutionStatus | null;
  testCreatedAt: string | null;
  testUpdatedAt: string | null;
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

// Schedule Types
export interface Schedule {
  id: number;
  testId: number;
  intervalSeconds: number;
  isActive: boolean;
  lastExecutedAt: string | null;
  nextExecutionAt: string | null;
  createdAt: string;
  updatedAt: string;
  name?: string;
  description?: string;
  testName?: string;
}

// ExecutionLog Types
export type ExecutionLogStatus = "processing" | "success" | "failed" | "timeout";

export interface ExecutionLog {
  id: number;
  executionId: number;
  testId: number;
  scheduleId: number | null;
  status: ExecutionLogStatus;
  message?: string;
  responseTime?: number;
  statusCode?: number;
  errorDetails?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  finishedAt?: string;
  testName?: string;
  url?: string;
  method?: string;
}

// Analytics Types
export interface ExecutionLogSummary {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  processingExecutions: number;
  averageResponseTime: number;
  successRate: number;
}

export interface ExecutionTrend {
  date: string;
  successCount: number;
  failedCount: number;
  averageResponseTime: number;
}

export interface AnalyticsData {
  summary: ExecutionLogSummary;
  recentExecutions: ExecutionLog[];
  executionsByStatus: Record<string, number>;
  executionsByTest: Record<string, number>;
  executionTrend: ExecutionTrend[];
}

