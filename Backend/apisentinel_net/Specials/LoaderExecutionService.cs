using DTOs.Dev;
using Interface.Dev;

namespace Services.Dev.Executions;

public class ExecutionLoader
{
    private readonly ITestsService _testsService;
    private readonly IExecutionsService _executionsService;

    public ExecutionLoader(
        ITestsService testsService,
        IExecutionsService executionsService)
    {
        _testsService = testsService;
        _executionsService = executionsService;
    }

    public async Task RunPendingExecutionsAsync(
        CancellationToken cancellationToken = default)
    {
        var tests = await _testsService.GetTestsFull();

        foreach (var test in tests)
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            try
            {
                await _executionsService.CreateExecution(
                    new RequestExecutionDTO
                    {
                        TestId = test.Id
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Erro ao executar teste {test.Id}: {ex.Message}");
            }
        }
    }
}