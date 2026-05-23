using Interface.Dev;
using DTOs.Dev;
using Microsoft.AspNetCore.Mvc;

namespace Controllers.Development;

/// <summary>
/// Gerenciamento de testes de APIs
/// </summary>
[ApiController]
[Route("tests")]
[Tags("Tests")]
[Produces("application/json")]
public class TestsController : ControllerBase
{
    public readonly ITestsService _testsService;

    public TestsController(ITestsService testsService)
    {
        _testsService = testsService;
    }

    /// <summary>
    /// Cria um novo teste de API
    /// </summary>
    /// <param name="request">Dados do teste a ser criado</param>
    /// <returns>Teste criado</returns>
    /// <response code="200">Teste criado com sucesso</response>
    /// <response code="400">Dados inválidos</response>
    [HttpPost("create-tests")]
    [ProducesResponseType(typeof(TestsDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateTest([FromBody] TestsDTO request)
    {
        var get = await _testsService.CreateTest(request);
        return Ok(get);
    }

    /// <summary>
    /// Atualiza parcialmente um teste existente
    /// </summary>
    /// <param name="id">ID do teste a ser atualizado</param>
    /// <param name="requests">Campos a serem atualizados</param>
    /// <returns>Teste atualizado</returns>
    /// <response code="200">Teste atualizado com sucesso</response>
    /// <response code="400">Dados inválidos</response>
    [HttpPatch("update/{id}")]
    [ProducesResponseType(typeof(TestsDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateTest(int id, [FromBody] RequestUpdateTestsDTO requests)
    {
        requests.Id = id;
        var get = await _testsService.PatchUpdateTest(requests);
        return Ok(get);
    }

    /// <summary>
    /// Busca todos os testes cadastrados com detalhes completos
    /// </summary>
    /// <returns>Lista completa de testes</returns>
    /// <response code="200">Lista retornada com sucesso</response>
    [HttpGet("get-tests-full")]
    [ProducesResponseType(typeof(IEnumerable<TestsDTO>), 200)]
    public async Task<IActionResult> GetTestsFull()
    {
        var get = await _testsService.GetTestsFull();
        return Ok(get);
    }

    /// <summary>
    /// Busca um teste pelo ID
    /// </summary>
    /// <param name="id">ID do teste</param>
    /// <returns>Dados do teste encontrado</returns>
    /// <response code="200">Teste encontrado</response>
    /// <response code="400">Teste não encontrado ou erro</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TestsDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetTestsById(int id)
    {
        try
        {
            var get = await _testsService.GetTestsById(id);
            return Ok(get);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Remove um teste pelo ID
    /// </summary>
    /// <param name="id">ID do teste a ser removido</param>
    /// <returns>Confirmação da remoção</returns>
    /// <response code="200">Teste removido com sucesso</response>
    /// <response code="400">Teste não encontrado ou erro</response>
    [HttpDelete("delete/{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> DeleteTestById(int id)
    {
        try
        {
            var get = await _testsService.DeleteTaskById(id);
            return Ok(get);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}