using DTOs.Dev;
using Interface.Dev;
using Models.Dev;
using Specials;
using Supabase;


namespace Services.Dev.Tests;

public class TestsService : ITestsService
{

    public readonly Supabase.Client _supabase;

    public TestsService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    
    public async Task<List<TestsDTO>> GetTestsFull() 
    {   

        var response = await _supabase
        .From<TestsModel>()
        .Get();

        return response.Models.Select(t => new TestsDTO
        {
            Id = t.Id,
            Name = t.Name,
            Url = t.Url,
            Method = t.Method,
            Headers = t.Headers,
            Body = t.Body,
            ExpectedStatusCode = t.ExpectedStatusCode,
            MaxResponseTime = t.MaxResponseTime,
            LastStatus = t.LastStatus,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt

        }).ToList();
    
    }
    public async Task<TestsDTO> GetTestsById(int id) 
    {   

        var response = await _supabase
        .From<TestsModel>()
        .Where(t => t.Id == id )
        .Get();

        var t = response.Models.FirstOrDefault();

        if (t == null)
            return null;


        return new TestsDTO
        {
            Id = t.Id,
            Name = t.Name,
            Url = t.Url,
            Method = t.Method,
            Headers = t.Headers,
            Body = t.Body,
            ExpectedStatusCode = t.ExpectedStatusCode,
            MaxResponseTime = t.MaxResponseTime,
            LastStatus = t.LastStatus,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt

        };
    
    }


    public async Task<TestsDTO> CreateTest(RequestTestsDTO request)
    {
        
        var test = new TestsModel()
        {
            Name = request.Name,
            Url = request.Url,
            Method = request.Method,
            Headers = request.Headers.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value)),
            Body = request.Body.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value)),
            ExpectedStatusCode = request.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime,
            LastStatus = request?.LastStatus ?? "PENDING",
            CreatedAt = DateTime.UtcNow

        };

        var response = await _supabase
        .From<TestsModel>()
        .Insert(test);

        var insertedTest = response.Model;

        return new TestsDTO
        {
            Id = insertedTest.Id,
            Name = request.Name,
            Url = request.Url,
            Method = request.Method,
            Headers = request.Headers.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value)),
            Body = request.Body.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value)),
            ExpectedStatusCode = request.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime,
            LastStatus = request?.LastStatus ?? "PENDING",
            CreatedAt = DateTime.UtcNow

        };
        
    }

    public async Task<TestsDTO> PatchUpdateTest(RequestUpdateTestsDTO request)
    {

         if (request == null)
         throw new Exception("request is null");
            


        //search
        var existingResponse = await _supabase
            .From<TestsModel>()
            .Where(x => x.Id == request.Id)
            .Get();

        var finalResponse = existingResponse.Models.FirstOrDefault();
        Console.WriteLine(finalResponse.CreatedAt);
        if (finalResponse == null)
        {
            throw new Exception("Test not found");
        }

        var updated = new TestsModel
        {
            Id = finalResponse.Id,
            Name = request.Name ?? finalResponse.Name,
            Url = request.Url ?? finalResponse.Url,
            Method = request.Method ?? finalResponse.Method,
            ExpectedStatusCode = request.ExpectedStatusCode ?? finalResponse.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime ?? finalResponse.MaxResponseTime,
            LastStatus = request.LastStatus ?? finalResponse.LastStatus,

            // headers e body
            Headers = request.Headers != null
                ? request.Headers.ToDictionary(
                    x => x.Key,
                    x => JsonHelper.Normalize(x.Value)
                )
                : finalResponse.Headers,

            Body = request.Body != null
                ? request.Body.ToDictionary(
                    x => x.Key,
                    x => JsonHelper.Normalize(x.Value)
                )
                : finalResponse.Body,

            UpdatedAt =  DateTime.UtcNow

            
        };

        

       var response = await _supabase
        .From<TestsModel>()
        .Where(x => x.Id == request.Id)
        .Set(x => x.Name, request.Name ?? finalResponse.Name)
        .Set(x => x.Url, request.Url ?? finalResponse.Url)
        .Set(x => x.Method, request.Method ?? finalResponse.Method)
        .Set(x => x.ExpectedStatusCode, request.ExpectedStatusCode ?? finalResponse.ExpectedStatusCode)
        .Set(x => x.MaxResponseTime, request.MaxResponseTime ?? finalResponse.MaxResponseTime)
        .Set(x => x.LastStatus, request.LastStatus ?? finalResponse.LastStatus)
        .Set(x => x.Headers, request.Headers ?? finalResponse.Headers)
        .Set(x => x.Body, request.Body ?? finalResponse.Body)
        .Set(x => x.UpdatedAt, DateTime.UtcNow)
        .Update();

        var insertedTest = response.Models.FirstOrDefault();

     

        return new TestsDTO
        {
            Id = insertedTest.Id,
            Name = request.Name,
            Url = request.Url,
            Method = request.Method,
            Headers = request.Headers, //.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value) ?? new Dictionary<string, object>()),
            Body = request.Body, //.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value) ?? new Dictionary<string, object>()),
            ExpectedStatusCode = request.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime,
            LastStatus = request?.LastStatus ?? "PENDING",
            CreatedAt = finalResponse.CreatedAt,
            UpdatedAt = updated.UpdatedAt

        };

    }

    public async Task<bool> DeleteTaskById(int id)
    {
        
        await _supabase
            .From<TestsModel>()
            .Where(test => test.Id == id)
            .Delete();

        return true;
    }


    



}


