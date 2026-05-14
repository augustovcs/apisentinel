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
        //outra forma
        decimal final_price = FinalPrice(request.price, request.discount);

        var produto = new ProductModel()
        {
            price = request.price,
            discount = request.discount,
            name = request.name,
            category = request.category,
            finalprice =  final_price

            
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
           finalprice = final_price
           
        };

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