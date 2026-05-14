using Product.models;
using Product.Services;
using Services;
namespace DTOs.Product;

public class ProductResponseDTO
{
    public int id { get; set; }
    
    public decimal price { get; set; }
    
    public decimal discount { get; set; }
    
    public string name { get; set; }
    
    public string category { get; set; }
    
    public decimal finalprice { get; set; }


    //tests
    public decimal finalprice2 { get; set; }

}





