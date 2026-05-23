using Services.Consorcio;
using DTOs;
using Services.UserService;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

/// <summary>
/// Gerenciamento de pessoas e consórcio
/// </summary>
[ApiController]
[Route("[controller]")]
[Tags("Users")]
[Produces("application/json")]
public class PessoaController : ControllerBase
{
    public readonly Consorcio _consorcio;
    public readonly UserService _service;

    public PessoaController(Consorcio consorcio, UserService service)
    {
        _service = service;
        _consorcio = consorcio;
    }

    /// <summary>
    /// Busca todos os usuários cadastrados
    /// </summary>
    /// <returns>Lista de usuários</returns>
    /// <response code="200">Lista retornada com sucesso</response>
    [HttpGet("/Pessoa")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> Search()
    {
        var gerarAlgo = await _service.GetUsers();
        return Ok(gerarAlgo);
    }

    /// <summary>
    /// Realiza o envio de um pagamento de consórcio
    /// </summary>
    /// <param name="pessoa">Dados da pessoa e valor do pagamento</param>
    /// <returns>Resultado do envio</returns>
    /// <response code="200">Pagamento enviado com sucesso</response>
    /// <response code="400">Dados inválidos</response>
    [HttpPost("/postconsorcio")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public IActionResult PostConsorcio([FromBody] PessoaDTO pessoa)
    {
        var sendPost = _consorcio.PostConsorcio(pessoa.Id, pessoa.CPF, pessoa.pagamento);
        return Ok(sendPost);
    }
}