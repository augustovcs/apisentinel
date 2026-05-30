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

    public ExecutionsService(Supabase.Client supabase, HttpClient httpClient)
    {
        _httpClient = httpClient;
        _supabase = supabase;
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

            await _supabase
                .From<ExecutionModel>()
                .Insert(execution);

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