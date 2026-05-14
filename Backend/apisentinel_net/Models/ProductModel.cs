using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Product.models;

[Table("product-teste")]

public class ProductModel : BaseModel
{
    [PrimaryKey("id")]
    public int Id { set; get; }
    
    [Column("price")]
    public double price { get; set; }
    
    [Column("discount")]
    public decimal discount { get; set; }
    
    [Column("name")]
    public string name { get; set; }
    
    [Column("category")]
    public string category { get; set; }
    
    [Column("finalprice")]
    public decimal finalprice { get; set; }
    
}