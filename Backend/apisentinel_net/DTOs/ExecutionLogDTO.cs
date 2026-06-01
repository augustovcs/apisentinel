namespace DTOs.Dev;

public class ExecutionLogDTO
{
    public long Id { get; set; }
    public long ExecutionId { get; set; }
    public long TestId { get; set; }
    public long? ScheduleId { get; set; }
    public string Status { get; set; } // "processing", "success", "failed", "timeout"
    public string? Message { get; set; }
    public int? ResponseTime { get; set; }
    public int? StatusCode { get; set; }
    public Dictionary<string, object>? ErrorDetails { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string? TestName { get; set; }
    public string? Url { get; set; }
    public string? Method { get; set; }
}

public class ExecutionLogSummaryDTO
{
    public long TotalExecutions { get; set; }
    public long SuccessfulExecutions { get; set; }
    public long FailedExecutions { get; set; }
    public long ProcessingExecutions { get; set; }
    public double AverageResponseTime { get; set; }
    public double SuccessRate { get; set; }
}

public class AnalyticsDataDTO
{
    public ExecutionLogSummaryDTO Summary { get; set; }
    public List<ExecutionLogDTO> RecentExecutions { get; set; }
    public Dictionary<string, int> ExecutionsByStatus { get; set; }
    public Dictionary<string, int> ExecutionsByTest { get; set; }
    public List<ExecutionTrendDTO> ExecutionTrend { get; set; }
}

public class ExecutionTrendDTO
{
    public DateTime Date { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public double AverageResponseTime { get; set; }
}
