using Interface.Dev;
using Services.Dev;
using DTOs.Dev;
using Specials.Dev;
using Services.Dev.Executions;

namespace Specials.Dev;

public class ExecutionScheduler : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IScheduleService _scheduleService;
    
    public ExecutionScheduler(IServiceProvider serviceProvider, IScheduleService scheduleService)
    {
        _serviceProvider = serviceProvider;
        _scheduleService = scheduleService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (!stoppingToken.IsCancellationRequested)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();

            var loader = scope.ServiceProvider
                .GetRequiredService<ExecutionLoader>();

            await loader.RunPendingExecutionsAsync(stoppingToken);

            // Verifica novamente em 5 segundos
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
}
    

    
