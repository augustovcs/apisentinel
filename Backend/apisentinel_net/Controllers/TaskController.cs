using Services.Finance;
using DTOs;
using Microsoft.AspNetCore.Mvc;


namespace Controllers.Development;

[ApiController]
[Route("[controller]")]

public class FinanceController : ControllerBase
{
    public readonly FinancialOperations _FinancialOperations;

    public FinanceController(FinancialOperations financialOperations)
    {
        _FinancialOperations = financialOperations;
    }


    [HttpGet("/Operation")]
    
    public async Task<ActionResult> search()
    {
        var algo = await _FinancialOperations.PostCalcularTudo(200, 20);

        return Ok(algo);
    }

    [HttpPost("/Finance")]

    public IActionResult PostFinance([FromBody] FinanceRequestDTO requestDto)
    {
        var SendPost = _FinancialOperations.Score(requestDto.ScoreDeCredito);

        return Ok(SendPost);
    }
    
}