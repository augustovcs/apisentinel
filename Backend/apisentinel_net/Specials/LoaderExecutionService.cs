using DTOs.Dev;
using Interface.Dev;
using Microsoft.Extensions.Logging;

namespace Services.Dev.Executions;

public class ExecutionLoader
{
    private readonly ITestsService _testsService;
    private readonly IExecutionsService _executionsService;
    private readonly IScheduleService _scheduleService;
    private readonly ILogger<ExecutionLoader> _logger;

    public ExecutionLoader(
        ITestsService testsService,
        IExecutionsService executionsService,
        IScheduleService scheduleService,
        ILogger<ExecutionLoader> logger)
    {
        _testsService = testsService;
        _executionsService = executionsService;
        _scheduleService = scheduleService;
        _logger = logger;
    }

    public async Task RunPendingExecutionsAsync(CancellationToken cancellationToken)
    {
        var services = await _scheduleService.GetActiveSchedules();

        var now = DateTimeOffset.UtcNow;
        var fired = 0;

        foreach (var service in services)
        {
            if (service.NextExecutionAt == null)
            {
                continue;
            }

            // Intervalo inválido faria nextExecution == now e dispararia a cada poll
            if (service.IntervalSeconds <= 0)
            {
                _logger.LogWarning(
                    "Schedule {ScheduleId} skipped: invalid interval ({Interval}s)",
                    service.Id, service.IntervalSeconds);
                continue;
            }

            // NextExecutionAt é DateTimeOffset: a comparação é por instante absoluto,
            // sem ambiguidade de fuso ao ler do Supabase.
            if (now < service.NextExecutionAt.Value)
            {
                continue;
            }

            var newNext = now.AddSeconds(service.IntervalSeconds);

            _logger.LogInformation(
                "Running schedule {ScheduleId} (test {TestId}, every {Interval}s). Next run at {Next:yyyy-MM-dd HH:mm:ss} UTC",
                service.Id, service.TestId, service.IntervalSeconds, newNext);

            try
            {
                await _executionsService.CreateExecution(
                    new RequestExecutionDTO
                    {
                        TestId = service.TestId
                    });

                await _scheduleService.UpdateExecutionInfo(service.Id, now, newNext);
                fired++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Schedule {ScheduleId} (test {TestId}) failed to run",
                    service.Id, service.TestId);
            }
        }

        if (fired > 0)
        {
            _logger.LogInformation("Scheduler tick: {Fired}/{Total} schedule(s) executed", fired, services.Count);
        }
    }
}
