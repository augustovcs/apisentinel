using DTOs.Product;

namespace Product.Services;

public class ProductService
{
    public readonly Supabase.Client _supabase;

    public ProductService(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    public async Task<ProductResponseDTO> CreateClient(ProductRequestDTO product)
    {
        var 
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