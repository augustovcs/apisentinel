using DTOs.Product;
using Microsoft.AspNetCore.Mvc;
using Product.Services;


namespace Controllers.Development;


[ApiController]
[Route("[controller]")]


public class ProductControlls : ControllerBase
{
    public readonly ProductService _clienteService;

    public ProductControlls(ProductService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpPost("/create-product")]
    public async Task<IActionResult> Create([FromBody] ProductRequestDTO request)
    {
        var gerarAlgo = await _clienteService.CreateClient(request);

        return Ok(gerarAlgo);
    }

    [HttpGet("/get-product")]
    public async Task<IActionResult> GetAllProducts()
    {
        var Products = await _clienteService.GetAllProducts();

        return Ok(Products);
    }

    [HttpDelete("/delete-produtc/{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var result = await _clienteService.DeleteProduct(id);

        if (!result) return NotFound("produto não encontrado");

        return Ok("Produto deletado com sucesso");
    }


}