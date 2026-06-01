using DTOs.Dev;

namespace Interface.Dev;

public interface IExecutionLogService
{
    Task<ExecutionLogDTO> CreateLog(ExecutionLogDTO logData);
    Task<ExecutionLogDTO> GetLogById(long id);
    Task<List<ExecutionLogDTO>> GetLogsByTestId(long testId);
    Task<List<ExecutionLogDTO>> GetLogsByScheduleId(long scheduleId);
    Task<List<ExecutionLogDTO>> GetAllLogs();
    Task<AnalyticsDataDTO> GetAnalyticsData();
    Task<List<ExecutionLogDTO>> GetLogsByDateRange(DateTime startDate, DateTime endDate);
    Task<ExecutionLogDTO> UpdateLogStatus(long logId, string status, string? message = null);
    Task<bool> DeleteLog(long id);
}
