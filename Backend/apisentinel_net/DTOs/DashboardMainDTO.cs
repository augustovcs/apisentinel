using System.Collections.Generic;

namespace DTOs.Dev;

public class DashboardMainDTO
{
    public int TotalTests { get; set; }
    public int SuccessRate { get; set; }
    public int FailedTests { get; set; }
    public int AvgResponseTime { get; set; }
    public List<DashboardExecutionDTO> RecentExecutions { get; set; } = new List<DashboardExecutionDTO>();
}

public class DashboardExecutionDTO
{
    public string? TestName { get; set; }
    public string? Status { get; set; }
    public int? StatusCode { get; set; }
    public int? ResponseTime { get; set; }
    public DateTime? ExecutedAt { get; set; }
}


