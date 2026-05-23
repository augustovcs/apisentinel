using Services.Finance;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

/// <summary>
/// Gerenciamento de clientes financeiros
/// </summary>
[ApiController]
[Route("[controller]")]
[Tags("Finance")]
[Produces("application/json")]
public class FinanceController : ControllerBase
{
    public readonly ClienteService _clienteService;

    public FinanceController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    /// <summary>
    /// Cria um novo cliente financeiro
    /// </summary>
    /// <param name="request">Dados do cliente a ser criado</param>
    /// <returns>Cliente criado com sucesso</returns>
    /// <response code="200">Cliente criado com sucesso</response>
    /// <response code="400">Dados inválidos</response>
    [HttpPost("/criar-usuario")]
    [ProducesResponseType(typeof(ClienteResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CriarClienteRequest request)
    {
        var result = await _clienteService.CriarAsync(request);
        return Ok(result);
    }
}