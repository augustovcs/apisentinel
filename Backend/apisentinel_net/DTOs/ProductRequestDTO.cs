// ─────────────────────────────────────────────
// DTOs/Product/ProductRequestDTO.cs
// ─────────────────────────────────────────────
namespace DTOs.Product;
 
public class ProductRequestDTO
{
    /// <example>1</example>
    public int id { get; set; }
 
    /// <example>199.90</example>
    public decimal price { get; set; }
 
    /// <example>10.00</example>
    public decimal discount { get; set; }
 
    /// <example>Notebook Gamer</example>
    public string name { get; set; }
 
    /// <example>Eletrônicos</example>
    public string category { get; set; }
 
    /// <example>189.90</example>
    public decimal finalprice { get; set; }
}