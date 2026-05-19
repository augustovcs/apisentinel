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

    [HttpPatch]
    public async Task<IActionResult> UpdateConfigs(
        [FromBody]
        RequestGeneralConfigsDTO request)
    {
        try
        {
            var result =
                await _service.UpdateConfigsAsync(
                    request
                );

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