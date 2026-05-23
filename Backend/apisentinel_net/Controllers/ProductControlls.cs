using DTOs.Product;
using Microsoft.AspNetCore.Mvc;
using Product.Services;

namespace Controllers.Development;

/// <summary>
/// Gerenciamento de produtos
/// </summary>
[ApiController]
[Route("[controller]")]
[Tags("Products")]
[Produces("application/json")]
public class ProductControlls : ControllerBase
{
    public readonly ProductService _clienteService;

    public ProductControlls(ProductService clienteService)
    {
        _clienteService = clienteService;
    }

    /// <summary>
    /// Cria um novo produto
    /// </summary>
    /// <param name="request">Dados do produto a ser criado</param>
    /// <returns>Produto criado</returns>
    /// <response code="200">Produto criado com sucesso</response>
    /// <response code="400">Dados inválidos</response>
    [HttpPost("/create-product")]
    [ProducesResponseType(typeof(ProductResponseDTO), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] ProductRequestDTO request)
    {
        var result = await _clienteService.CreateClient(request);
        return Ok(result);
    }

    /// <summary>
    /// Busca todos os produtos cadastrados
    /// </summary>
    /// <returns>Lista de produtos</returns>
    /// <response code="200">Lista retornada com sucesso</response>
    [HttpGet("/get-product")]
    [ProducesResponseType(typeof(IEnumerable<ProductResponseDTO>), 200)]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _clienteService.GetAllProducts();
        return Ok(products);
    }

    /// <summary>
    /// Remove um produto pelo ID
    /// </summary>
    /// <param name="id">ID do produto a ser removido</param>
    /// <returns>Mensagem de confirmação</returns>
    /// <response code="200">Produto deletado com sucesso</response>
    /// <response code="404">Produto não encontrado</response>
    [HttpDelete("/delete-product/{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var result = await _clienteService.DeleteProduct(id);

        if (!result) return NotFound("produto não encontrado");

        return Ok("Produto deletado com sucesso");
    }
}