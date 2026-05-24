using Interface.Dev;
using DTOs.Dev;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;


/// <summary>
/// Gerenciamento de execuções de APIs
/// </summary>
[ApiController]
[Route("executions")]
[Tags("Executions")]
[Produces("application/json")]
public class ExecutionTestController : ControllerBase
{
    public readonly IExecutionsService _executionsService;

    public ExecutionTestController(IExecutionsService executionsService)
    {
        _executionsService = executionsService;
    }
    

    [HttpGet("get-executions-full")]
    public async Task<IActionResult> GetExecutionsFull()
    {
        var get = await _executionsService.GetExecutionsFull();
        return Ok(get);
    }


}