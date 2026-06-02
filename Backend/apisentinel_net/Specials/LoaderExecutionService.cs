using DTOs.Dev;
using Interface.Dev;

namespace Services.Dev.Executions;

public class ExecutionLoader
{
    private readonly ITestsService _testsService;
    private readonly IExecutionsService _executionsService;
    private readonly IScheduleService _scheduleService;

    public ExecutionLoader(
        ITestsService testsService,
        IExecutionsService executionsService, IScheduleService scheduleService)
    {
        _testsService = testsService;
        _executionsService = executionsService;
        _scheduleService = scheduleService;
    }

    public async Task RunPendingExecutionsAsync(CancellationToken cancellationToken)
    {
        var services = await _scheduleService.GetActiveSchedules();

        var now = DateTime.UtcNow;

        foreach (var service in services)
        {
            if (service.LastExecutedAt == null)
            {
                continue;
            }

            var nextExecution =
                service.LastExecutedAt.Value.AddSeconds(service.IntervalSeconds);

            if (now >= service.NextExecutionAt)
            {
                await _executionsService.CreateExecution(
                    new RequestExecutionDTO
                    {
                        TestId = service.TestId
                    }
                );


                await _scheduleService.UpdateExecutionInfo(service.Id, now, now.AddSeconds(service.IntervalSeconds));
            }
        }
    }
}