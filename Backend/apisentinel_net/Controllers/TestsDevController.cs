using Interface.Dev;
using DTOs.Dev;
using Microsoft.AspNetCore.Mvc;


namespace Controllers.Development;

[ApiController]
[Route("[controller]")]

public class TestsController : ControllerBase
{
    public readonly ITestsService _testsService;

    public TestsController(ITestsService testsService)
    {
        _testsService = testsService;
        
    }
    
    [HttpGet("/get-tests-full")]
    public async Task<IActionResult> GetTestsFull()
    {
        
        var get = await _testsService.GetTestsFull();

        return Ok(get);
    }

    [HttpGet("get-by-{id}")]
    public async Task<IActionResult> GetTestsById(int id)
    {
        
        var get = await _testsService.GetTestsById(id);

        return Ok(get);
    }
}