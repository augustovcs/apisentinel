using General.DTOs;
using Interface.general;
using Microsoft.AspNetCore.Mvc;

namespace Controllers;

[ApiController]
[Route("general-configs")]
public class GeneralConfigsController : ControllerBase
{
    private readonly IGeneralConfigsService _service;

    public GeneralConfigsController(
        IGeneralConfigsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetConfigs()
    {
        try
        {
            var result =
                await _service.GetConfigsAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPatch("update/{id}")]
    public async Task<IActionResult> UpdateConfigs(
        int id,
        [FromBody] RequestGeneralConfigsDTO requests)
    {
        if (id != 1)
        {
            return BadRequest(new
            {
                message = "apenas o id 1 é permitido"
            });
        }

        var get =
            await _service.UpdateConfigsAsync(
                requests
            );

        return Ok(get);
    }

    [HttpPost("regenerate-api-key")]
    public async Task<IActionResult> RegenerateApiKey()
    {
        try
        {
            var apiKey =
                await _service.RegenerateApiKey();

            return Ok(new
            {
                api_key = apiKey
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}