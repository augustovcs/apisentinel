using Interface.Dev;
using DTOs.Dev;
using Microsoft.AspNetCore.Mvc;


namespace Controllers.Development;

[ApiController]
[Route("tests")]

public class TestsController : ControllerBase
{
    public readonly ITestsService _testsService;

    public TestsController(ITestsService testsService)
    {
        _testsService = testsService;
        
    }


    // POST METHODS //
    [HttpPost("create-tests")]
    public async Task<IActionResult> CreateTest([FromBody]TestsDTO request)
    {

        throw new NotImplementedException();
        
    }


    // GET METHODS //
    
    [HttpGet("get-tests-full")]
    public async Task<IActionResult> GetTestsFull()
    {
        
        var get = await _testsService.GetTestsFull();

        return Ok(get);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTestsById(int id)
    {
        try
        {
            var get = await _testsService.GetTestsById(id);
            return Ok(get);

        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
            
        }
    
    }
}