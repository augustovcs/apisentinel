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
    
    [HttpPost("/criar-product")]


}