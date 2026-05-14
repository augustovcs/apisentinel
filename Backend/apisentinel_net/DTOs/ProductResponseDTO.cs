namespace DTOs.Product;

public class ProductResponseDTO
{
    public int id { get; set; }
    
    public double price { get; set; }
    
    public decimal discount { get; set; }
    
    public string name { get; set; }
    
    public string category { get; set; }
    
    public decimal finalprice { get; set; }
}