using DTOs.Product;
using Microsoft.VisualBasic;
using Product.models;

namespace Product.Services;

public class ProductService
{
    public readonly Supabase.Client _supabase;

    public ProductService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<ProductResponseDTO> CreateClient(ProductRequestDTO request)
    {

        decimal final_price = FinalPrice(request.price, request.discount);

        var produto = new ProductModel()
        {
            price = request.price,
            discount = request.discount,
            name = request.name,
            category = request.category,
            finalprice = final_price


        };


        var response = await _supabase
            .From<ProductModel>()
            .Insert(produto);

        var produtoInserido = response.Model;

        return new ProductResponseDTO
        {
            discount = request.discount,
            name = request.name,
            id = produtoInserido?.Id ?? 0,
            price = request.price,
            category = request.category,
            finalprice = final_price

        };

    }

    public async Task<List<ProductResponseDTO>> GetAllProducts()
        {
            var response = await _supabase
                .From<ProductModel>()
                .Get();

            return response.Models.Select(p => new ProductResponseDTO
            {
                id = p.Id,
                name = p.name,
                price = p.price,
                discount = p.discount,
                category = p.category,
                finalprice = p.finalprice

            }).ToList();
        }

    public async Task<bool> DeleteProduct(int id)
    {
        await _supabase
            .From<ProductModel>()
            .Where(p => p.Id == id)
            .Delete();

        return true;
    }

    

    public decimal CalcularPrice(decimal price, decimal discount)
    {
        return price * (discount / 100);
    }

    //puxa o finalprice -> calculaprice ja vem junto

    public decimal FinalPrice(decimal price, decimal discount)
    {
        if (price > 100)
        {
            decimal desconto = CalcularPrice(price, discount);
            return price - desconto;
        }

        return price;
    }

    

    
}