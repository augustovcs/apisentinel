using DTOs.Dev;
using Interface.Dev;
using Models.Dev;
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
            ExpectedStatusCode = t.ExpectedStatusCode,
            MaxResponseTime = t.MaxResponseTime,
            LastStatus = t.LastStatus,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt

        }).ToList();


    }



}


