using DTOs.Dev;
using Interface.Dev;
using Models.Dev;
using Supabase;
using System.Globalization;

namespace Services.Dev.Logs;

public class ExecutionLogService : IExecutionLogService
{
    private readonly Supabase.Client _supabase;

    public ExecutionLogService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<ExecutionLogDTO> CreateLog(ExecutionLogDTO logData)
    {
        var log = new ExecutionLogModel
        {
            ExecutionId = logData.ExecutionId,
            TestId = logData.TestId,
            ScheduleId = logData.ScheduleId,
            Status = logData.Status,
            Message = logData.Message,
            ResponseTime = logData.ResponseTime,
            StatusCode = logData.StatusCode,
            ErrorDetails = logData.ErrorDetails,
            TestName = logData.TestName,
            Url = logData.Url,
            Method = logData.Method,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            StartedAt = logData.StartedAt ?? DateTime.UtcNow,
            FinishedAt = logData.FinishedAt
        };

        var insertedLog = await _supabase
            .From<ExecutionLogModel>()
            .Insert(log);

        var createdLog = insertedLog.Models.First();

        return MapToDTO(createdLog);
    }

    public async Task<ExecutionLogDTO> GetLogById(long id)
    {
        var log = await _supabase
            .From<ExecutionLogModel>()
            .Where(x => x.Id == id)
            .Single();

        if (log == null)
        {
            throw new Exception("Log not found.");
        }

        return MapToDTO(log);
    }

    public async Task<List<ExecutionLogDTO>> GetLogsByTestId(long testId)
    {
        var logsResponse = await _supabase
            .From<ExecutionLogModel>()
            .Where(x => x.TestId == testId)
            .Get();

        return logsResponse.Models
            .Select(MapToDTO)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<List<ExecutionLogDTO>> GetLogsByScheduleId(long scheduleId)
    {
        var logsResponse = await _supabase
            .From<ExecutionLogModel>()
            .Where(x => x.ScheduleId == scheduleId)
            .Get();

        return logsResponse.Models
            .Select(MapToDTO)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<List<ExecutionLogDTO>> GetAllLogs()
    {
        var logsResponse = await _supabase
            .From<ExecutionLogModel>()
            .Get();

        return logsResponse.Models
            .Select(MapToDTO)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<AnalyticsDataDTO> GetAnalyticsData()
    {
        var logsResponse = await _supabase
            .From<ExecutionLogModel>()
            .Get();

        var logs = logsResponse.Models.ToList();

        var totalExecutions = logs.Count;
        var successfulExecutions = logs.Count(x => x.Status == "success");
        var failedExecutions = logs.Count(x => x.Status == "failed");
        var processingExecutions = logs.Count(x => x.Status == "processing");
        var averageResponseTime = logs.Where(x => x.ResponseTime.HasValue)
            .Average(x => x.ResponseTime.GetValueOrDefault());
        var successRate = totalExecutions > 0 ? (double)successfulExecutions / totalExecutions * 100 : 0;

        var executionsByStatus = logs
            .GroupBy(x => x.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        var executionsByTest = logs
            .GroupBy(x => x.TestName ?? "Unknown")
            .ToDictionary(g => g.Key, g => g.Count());

        // Trend últimos 30 dias
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var logsLastMonth = logs.Where(x => x.CreatedAt >= thirtyDaysAgo).ToList();

        var executionTrend = logsLastMonth
            .GroupBy(x => x.CreatedAt.Date)
            .Select(g => new ExecutionTrendDTO
            {
                Date = g.Key,
                SuccessCount = g.Count(x => x.Status == "success"),
                FailedCount = g.Count(x => x.Status == "failed"),
                AverageResponseTime = g.Where(x => x.ResponseTime.HasValue)
                    .Average(x => x.ResponseTime.GetValueOrDefault())
            })
            .OrderBy(x => x.Date)
            .ToList();

        return new AnalyticsDataDTO
        {
            Summary = new ExecutionLogSummaryDTO
            {
                TotalExecutions = totalExecutions,
                SuccessfulExecutions = successfulExecutions,
                FailedExecutions = failedExecutions,
                ProcessingExecutions = processingExecutions,
                AverageResponseTime = double.IsNaN(averageResponseTime) ? 0 : averageResponseTime,
                SuccessRate = successRate
            },
            RecentExecutions = logs
                .Select(MapToDTO)
                .OrderByDescending(x => x.CreatedAt)
                .Take(100)
                .ToList(),
            ExecutionsByStatus = executionsByStatus,
            ExecutionsByTest = executionsByTest,
            ExecutionTrend = executionTrend
        };
    }

    public async Task<List<ExecutionLogDTO>> GetLogsByDateRange(DateTime startDate, DateTime endDate)
    {
        var logsResponse = await _supabase
            .From<ExecutionLogModel>()
            .Get();

        return logsResponse.Models
            .Where(x => x.CreatedAt >= startDate && x.CreatedAt <= endDate)
            .Select(MapToDTO)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<ExecutionLogDTO> UpdateLogStatus(long logId, string status, string? message = null)
    {
        var log = await _supabase
            .From<ExecutionLogModel>()
            .Where(x => x.Id == logId)
            .Single();

        if (log == null)
        {
            throw new Exception("Log not found.");
        }

        log.Status = status;
        log.Message = message ?? log.Message;
        log.UpdatedAt = DateTime.UtcNow;

        if (status == "success" || status == "failed")
        {
            log.FinishedAt = DateTime.UtcNow;
        }

        var updated = await _supabase
            .From<ExecutionLogModel>()
            .Update(log);

        var updatedLog = updated.Models.First();

        return MapToDTO(updatedLog);
    }

    public async Task<bool> DeleteLog(long id)
    {
        var log = await _supabase
            .From<ExecutionLogModel>()
            .Where(x => x.Id == id)
            .Single();

        if (log == null)
        {
            throw new Exception("Log not found.");
        }

        await _supabase
            .From<ExecutionLogModel>()
            .Delete(log);

        return true;
    }

    private ExecutionLogDTO MapToDTO(ExecutionLogModel log)
    {
        return new ExecutionLogDTO
        {
            Id = log.Id,
            ExecutionId = log.ExecutionId,
            TestId = log.TestId,
            ScheduleId = log.ScheduleId,
            Status = log.Status,
            Message = log.Message,
            ResponseTime = log.ResponseTime,
            StatusCode = log.StatusCode,
            ErrorDetails = log.ErrorDetails,
            CreatedAt = log.CreatedAt,
            UpdatedAt = log.UpdatedAt,
            StartedAt = log.StartedAt,
            FinishedAt = log.FinishedAt,
            TestName = log.TestName,
            Url = log.Url,
            Method = log.Method
        };
    }
}
