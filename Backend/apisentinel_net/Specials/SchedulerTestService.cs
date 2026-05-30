using Interface.Dev;
using Services.Dev;
using DTOs.Dev;
using Specials.Dev;
using Services.Dev.Executions;

namespace Specials.Dev;

public class ExecutionScheduler : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public ExecutionScheduler(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();

                var loader =
                    scope.ServiceProvider.GetRequiredService<ExecutionLoader>();

                await loader.RunPendingExecutionsAsync(stoppingToken);

                await Task.Delay(
                    TimeSpan.FromSeconds(5),
                    stoppingToken);
            }
        }
}
    
