using Services.Dev.Tests;
using DTOs.Dev;
using Microsoft.AspNetCore.Mvc;


namespace Controllers.Development;

[ApiController]
[Route("[controller]")]

public class TestsController : ControllerBase
{
    public readonly TestsService _testsService;

    public TestsController(TestsService testsService)
    {
        _testsService = testsService;
        
    }
    
    [HttpPost("/get-tests-full")]
    public async Task<IActionResult> GetTestsFull()
    {
        
        var get = await _testsService.GetTestsFull();

        return Ok(get);
    }
}