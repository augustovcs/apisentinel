using DTOs.Dev;
using Models.Dev;
using Supabase;
using Interface.Dev;
using System.Linq;

namespace Services.Pages;

/// <summary>
/// Implementation of <see cref="IPagesRequest"/>.
/// This service composes data from multiple tables (tests, executions, etc.)
/// and returns DTOs optimized for page-level consumption (dashboard, paginated lists).
/// Keep methods read-only and focused on aggregation/compilation logic.
/// </summary>
public class PagesRequest : IPagesRequest
{
    private readonly Supabase.Client _supabase;

    public PagesRequest(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    /// <summary>
    /// Aggregates tests and executions into a single dashboard DTO.
    /// Performs minimal in-memory computation after fetching the required rows.
    /// </summary>
    public async Task<DashboardMainDTO> GetDashboardMainAsync()
    {
        // fetch tests and executions in parallel
        var testsTask = _supabase.From<TestsModel>().Get();
        var execTask = _supabase.From<ExecutionModel>().Get();

        await Task.WhenAll(testsTask, execTask);

        var testsResp = testsTask.Result;
        var execResp = execTask.Result;

        var tests = testsResp.Models ?? new List<TestsModel>();
        var executions = execResp.Models ?? new List<ExecutionModel>();

        var totalTests = tests.Count;
        var successCount = tests.Count(t => string.Equals(t.LastStatus, "success", StringComparison.OrdinalIgnoreCase));
        var failedCount = tests.Count(t => string.Equals(t.LastStatus, "failed", StringComparison.OrdinalIgnoreCase));
        var successRate = totalTests > 0 ? (int)Math.Round((double)successCount / totalTests * 100) : 0;
        var avgResponseTime = totalTests > 0 ? (int)Math.Round(tests.Average(t => (double?)(t.MaxResponseTime ?? 0))) : 0;

        var recentExecutions = executions
            .OrderByDescending(e => e.ExecutedAt ?? DateTime.MinValue)
            .Take(8)
            .Select(e => new DashboardExecutionDTO
            {
                TestName = tests.FirstOrDefault(t => t.Id == e.TestId)?.Name,
                Status = e.Status,
                StatusCode = e.StatusCode,
                ResponseTime = e.ResponseTime,
                ExecutedAt = e.ExecutedAt
            })
            .ToList();

        return new DashboardMainDTO
        {
            TotalTests = totalTests,
            SuccessRate = successRate,
            FailedTests = failedCount,
            AvgResponseTime = avgResponseTime,
            RecentExecutions = recentExecutions
        };
    }
}
