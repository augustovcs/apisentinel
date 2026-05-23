using General.DTOs;
using Interface.general;
using Microsoft.AspNetCore.Mvc;

namespace Controllers;

/// <summary>
/// Gerenciamento das configurações gerais da plataforma
/// </summary>
[ApiController]
[Route("general-configs")]
[Tags("General Configs")]
[Produces("application/json")]
public class GeneralConfigsController : ControllerBase
{
    private readonly IGeneralConfigsService _service;

    public GeneralConfigsController(IGeneralConfigsService service)
    {
        _service = service;
    }

    /// <summary>
    /// Busca as configurações gerais da plataforma
    /// </summary>
    /// <returns>Objeto com todas as configurações atuais</returns>
    /// <response code="200">Configurações retornadas com sucesso</response>
    /// <response code="400">Erro ao buscar configurações</response>
    [HttpGet]
    [ProducesResponseType(typeof(GeneralConfigsDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetConfigs()
    {
        try
        {
            var result = await _service.GetConfigsAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza as configurações gerais da plataforma
    /// </summary>
    /// <param name="id">ID da configuração (apenas o id 1 é permitido)</param>
    /// <param name="requests">Campos a serem atualizados</param>
    /// <returns>Configurações atualizadas</returns>
    /// <response code="200">Configurações atualizadas com sucesso</response>
    /// <response code="400">ID inválido ou erro na atualização</response>
    [HttpPatch("update/{id}")]
    [ProducesResponseType(typeof(GeneralConfigsDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateConfigs(int id, [FromBody] RequestGeneralConfigsDTO requests)
    {
        if (id != 1)
            return BadRequest(new { message = "apenas o id 1 é permitido" });

        var get = await _service.UpdateConfigsAsync(requests);
        return Ok(get);
    }

    /// <summary>
    /// Regenera a API Key da plataforma
    /// </summary>
    /// <param name="id">ID da configuração (apenas o id 1 é permitido)</param>
    /// <returns>Nova API Key gerada</returns>
    /// <response code="200">API Key regenerada com sucesso</response>
    /// <response code="400">ID inválido</response>
    [HttpPost("regenerate-api-key/{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> RegenerateApiKey(int id)
    {
        if (id != 1)
            return BadRequest(new { message = "apenas o id 1 é permitido" });

        var apiKey = await _service.RegenerateApiKey();
        return Ok(new { api_key = apiKey });
    }
}