using DTOs.Dev;
using Interface.Dev;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

[ApiController]
[Route("schedules")]
[Tags("Schedules")]
[Produces("application/json")]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleService _scheduleService;

    public ScheduleController(IScheduleService scheduleService)
    {
        _scheduleService = scheduleService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateSchedule([FromBody] RequestScheduleDTO request)
    {
        try
        {
            var schedule = await _scheduleService.CreateSchedule(request);
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetScheduleById(long id)
    {
        try
        {
            var schedule = await _scheduleService.GetScheduleById(id);
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("list/all")]
    public async Task<IActionResult> GetAllSchedules()
    {
        try
        {
            var schedules = await _scheduleService.GetAllSchedules();
            return Ok(schedules);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("list/active")]
    public async Task<IActionResult> GetActiveSchedules()
    {
        try
        {
            var schedules = await _scheduleService.GetActiveSchedules();
            return Ok(schedules);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateSchedule([FromBody] UpdateScheduleDTO request)
    {
        try
        {
            var schedule = await _scheduleService.UpdateSchedule(request);
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchedule(long id)
    {
        try
        {
            await _scheduleService.DeleteSchedule(id);
            return Ok(new { message = "Schedule deleted successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> ToggleSchedule(long id, [FromQuery] bool isActive)
    {
        try
        {
            await _scheduleService.ToggleSchedule(id, isActive);
            return Ok(new { message = $"Schedule toggled to {isActive}." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
