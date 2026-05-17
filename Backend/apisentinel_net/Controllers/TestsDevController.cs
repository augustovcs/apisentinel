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

        var get = await _testsService.CreateTest(request);
        return Ok(get);
        
    }

    //PATCH METHODS 
    [HttpPatch("update/{id}")]
    public async Task<IActionResult> UpdateTest(int id, [FromBody]RequestUpdateTestsDTO requests)
    {
        requests.Id = id;

        var get = await _testsService.PatchUpdateTest(requests);
        return Ok(get);
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


    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteTestById (int id)
    {
        try
        {
            
            var get = await _testsService.DeleteTaskById(id);
            return Ok(get);

        }

        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}