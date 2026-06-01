using DTOs.Dev;
using Interface.Dev;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

[ApiController]
[Route("logs")]
[Tags("Execution Logs")]
[Produces("application/json")]
public class ExecutionLogController : ControllerBase
{
    private readonly IExecutionLogService _executionLogService;

    public ExecutionLogController(IExecutionLogService executionLogService)
    {
        _executionLogService = executionLogService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateLog([FromBody] ExecutionLogDTO logData)
    {
        try
        {
            var log = await _executionLogService.CreateLog(logData);
            return Ok(log);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLogById(long id)
    {
        try
        {
            var log = await _executionLogService.GetLogById(id);
            return Ok(log);
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("test/{testId}")]
    public async Task<IActionResult> GetLogsByTestId(long testId)
    {
        try
        {
            var logs = await _executionLogService.GetLogsByTestId(testId);
            return Ok(logs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("schedule/{scheduleId}")]
    public async Task<IActionResult> GetLogsByScheduleId(long scheduleId)
    {
        try
        {
            var logs = await _executionLogService.GetLogsByScheduleId(scheduleId);
            return Ok(logs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("list/all")]
    public async Task<IActionResult> GetAllLogs()
    {
        try
        {
            var logs = await _executionLogService.GetAllLogs();
            return Ok(logs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("analytics/data")]
    public async Task<IActionResult> GetAnalyticsData()
    {
        try
        {
            var analytics = await _executionLogService.GetAnalyticsData();
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("date-range")]
    public async Task<IActionResult> GetLogsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var logs = await _executionLogService.GetLogsByDateRange(startDate, endDate);
            return Ok(logs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateLogStatus(long id, [FromQuery] string status, [FromQuery] string? message = null)
    {
        try
        {
            var log = await _executionLogService.UpdateLogStatus(id, status, message);
            return Ok(log);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLog(long id)
    {
        try
        {
            await _executionLogService.DeleteLog(id);
            return Ok(new { message = "Log deleted successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
