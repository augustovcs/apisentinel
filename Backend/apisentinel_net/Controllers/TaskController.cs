using Services.Finance;
using DTOs;
using Microsoft.AspNetCore.Mvc;


namespace Controllers.Development;

[ApiController]
[Route("[controller]")]

public class FinanceController : ControllerBase
{
    public readonly ClienteService _clienteService;

    public FinanceController(ClienteService clienteService)
    {
        _clienteService = clienteService;
        
    }
    
    [HttpPost("/criar-usuario")]
    public async Task<IActionResult> Create([FromBody]CriarClienteRequest request)
    {
        
        var gerarAlgo = await _clienteService.CriarAsync(request);

        return Ok(gerarAlgo);
    }
}