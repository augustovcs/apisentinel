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
            Headers = request.Headers,
            Body = request.Body.ToDictionary(x => x.Key, x => JsonHelper.Normalize(x.Value)),
            ExpectedStatusCode = request.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime,
            LastStatus = request?.LastStatus ?? "PENDING"
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
            Headers = request.Headers,
            Body = request.Body,
            ExpectedStatusCode = request.ExpectedStatusCode,
            MaxResponseTime = request.MaxResponseTime,
            LastStatus = request?.LastStatus ?? "PENDING"

        };
        



    }

    



}


