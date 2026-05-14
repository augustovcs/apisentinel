using DTOs.Product;
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
        var produto = new ProductModel()
        {
            price = request.price,
            discount = request.discount,
            name = request.name,
            category = request.category,
            finalprice = request.finalprice
            
            
            
        };

        await _supabase.From<ProductModel>()
            .Insert(produto);

        return new ProductResponseDTO
        {
           discount = request.discount,
           name = request.name,
           id = request.id,
           price = request.price,
           category = request.category,
           finalprice = request.finalprice
           
        };

    }

    public decimal CalcularPrice(decimal price, decimal discount)
    {
        return price * (discount / 100);
    }

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