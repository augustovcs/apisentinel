using DTOs.Dev;
using Interface.Dev;
using Models.Dev;
using Specials;
using Supabase;
using System.Diagnostics;
using System.Text;

namespace Services.Dev.Executions;

public class ExecutionsService : IExecutionsService
{

    public readonly HttpClient _httpClient;
    public readonly Supabase.Client _supabase;
    private readonly IExecutionLogService _executionLogService;

    public ExecutionsService(Supabase.Client supabase, HttpClient httpClient, IExecutionLogService executionLogService)
    {
        _httpClient = httpClient;
        _supabase = supabase;
        _executionLogService = executionLogService;
    }

    public async Task<ResponseExecutionDTO> CreateExecution(RequestExecutionDTO request)
    {
       
       // Busca o teste pelo ID
        var test = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == request.TestId)
            .Single();

        if (test == null)
        {
            throw new Exception("Test not found.");
        }

        var stopwatch = Stopwatch.StartNew();
        long executionId = 0;

        try
        {
            // Define método HTTP dinamicamente
            var httpMethod = new HttpMethod(test.Method);

            var httpRequest = new HttpRequestMessage(httpMethod, test.Url);

            // Headers
            if (test.Headers != null)
            {
                foreach (var header in test.Headers)
                {
                    httpRequest.Headers.TryAddWithoutValidation(
                        header.Key,
                        header.Value.ToString()
                    );
                }
            }

            // Body
            if (!string.IsNullOrWhiteSpace(test.Body.ToString()))
            {
                httpRequest.Content = new StringContent(
                    test.Body.ToString(),
                    Encoding.UTF8,
                    "application/json"
                );
            }

            // Executa request
            var response = await _httpClient.SendAsync(httpRequest);

            stopwatch.Stop();

            // Define status lógico
            var executionStatus =
                response.IsSuccessStatusCode ? "success" : "failed";

            // Cria execution
            var execution = new ExecutionModel
            {
                TestId = test.Id,
                Status = executionStatus,
                StatusCode = (int)response.StatusCode,
                ResponseTime = (int)stopwatch.ElapsedMilliseconds,
                Error = response.IsSuccessStatusCode
                    ? null
                    : $"Request failed with status {(int)response.StatusCode}",
                ExecutedAt = DateTime.UtcNow
            };

            // Salva no banco
            var insertedExecution = await _supabase
                .From<ExecutionModel>()
                .Insert(execution);

            var createdExecution = insertedExecution.Models.First();
            executionId = createdExecution.Id;

            // Registra log de execução
            try
            {
                var logEntry = new ExecutionLogDTO
                {
                    ExecutionId = createdExecution.Id,
                    TestId = test.Id,
                    Status = executionStatus == "success" ? "success" : "failed",
                    Message = executionStatus == "success" ? "Execution completed successfully" : $"Request failed with status {(int)response.StatusCode}",
                    ResponseTime = (int)stopwatch.ElapsedMilliseconds,
                    StatusCode = (int)response.StatusCode,
                    TestName = test.Name,
                    Url = test.Url,
                    Method = test.Method
                };
                await _executionLogService.CreateLog(logEntry);
            }
            catch (Exception logEx)
            {
                // Log registration should not fail the execution
                Console.WriteLine($"Failed to register execution log: {logEx.Message}");
            }

            // Retorno DTO
            return new ResponseExecutionDTO
            {
                Id = createdExecution.Id,
                TestId = createdExecution.TestId,
                TestName = test.Name,
                Status = createdExecution.Status,
                StatusCode = createdExecution.StatusCode,
                ResponseTime = createdExecution.ResponseTime,
                Error = createdExecution.Error,
                ExecutedAt = createdExecution.ExecutedAt
            };
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            // Salva erro também
            var execution = new ExecutionModel
            {
                TestId = test.Id,
                Status = "error",
                ResponseTime = (int)stopwatch.ElapsedMilliseconds,
                Error = ex.Message,
                ExecutedAt = DateTime.UtcNow
            };

            var insertedExecution = await _supabase
                .From<ExecutionModel>()
                .Insert(execution);

            var createdExecution = insertedExecution.Models.First();
            executionId = createdExecution.Id;

            // Registra log de erro
            try
            {
                var logEntry = new ExecutionLogDTO
                {
                    ExecutionId = createdExecution.Id,
                    TestId = test.Id,
                    Status = "failed",
                    Message = ex.Message,
                    ResponseTime = (int)stopwatch.ElapsedMilliseconds,
                    TestName = test.Name,
                    Url = test.Url,
                    Method = test.Method,
                    ErrorDetails = new Dictionary<string, object> { { "exceptionMessage", ex.Message } }
                };
                await _executionLogService.CreateLog(logEntry);
            }
            catch (Exception logEx)
            {
                Console.WriteLine($"Failed to register execution log: {logEx.Message}");
            }

            throw;
        }

    }

    public Task<bool> DeleteExecutionById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<ResponseExecutionDTO> GetExecutionById(int id)
    {
        var execution = await _supabase
            .From<ExecutionModel>()
            .Where(x => x.Id == id)
            .Single();

        if (execution == null)
        {
            throw new Exception("Execution not found.");
        }

        var test = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == execution.TestId)
            .Single();

        return new ResponseExecutionDTO
        {
            Id = execution.Id,
            TestId = execution.TestId,
            TestName = test?.Name,
            Status = execution.Status,
            StatusCode = execution.StatusCode,
            ResponseTime = execution.ResponseTime,
            Error = execution.Error,
            ExecutedAt = execution.ExecutedAt,
            Url = test?.Url,
            Method = test?.Method,
            RequestHeaders = test?.Headers,
            RequestBody = test?.Body,
            ExpectedStatusCode = test?.ExpectedStatusCode,
            MaxResponseTime = test?.MaxResponseTime,
            TestLastStatus = test?.LastStatus,
            TestCreatedAt = test?.CreatedAt,
            TestUpdatedAt = test?.UpdatedAt
        };
    }

    public async Task<List<ResponseExecutionDTO>> GetExecutionsFull()
    {
        var executionsResponse = await _supabase
            .From<ExecutionModel>()
            .Get();

        var testsResponse = await _supabase
            .From<TestsModel>()
            .Get();

        var tests = testsResponse.Models.ToDictionary(t => t.Id, t => t.Name);

        return executionsResponse.Models.Select(e => new ResponseExecutionDTO
        {
            Id = e.Id,
            TestId = e.TestId,
            TestName = tests.TryGetValue(e.TestId, out var testName) ? testName : null,
            Status = e.Status,
            ResponseTime = e.ResponseTime,
            StatusCode = e.StatusCode,
            Error = e.Error,
            ExecutedAt = e.ExecutedAt

        })
        .OrderByDescending(x => x.ExecutedAt)
        .ToList();
    }

    public Task<ResponseExecutionDTO> PatchUpdateExecution(RequestExecutionDTO request)
    {
        throw new NotImplementedException();
    }
}