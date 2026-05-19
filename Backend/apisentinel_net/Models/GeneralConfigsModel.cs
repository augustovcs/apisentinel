using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models;

[Table("general_configs")]

public class GeneralConfigsModel : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    
    [Column("plataforme_name")]
    public string plataform_name { get; set; }
    
    [Column("default_timeout")]
    public int default_timeout { get; set; }
    
    [Column("timezone")]
    public string timezone { get; set; }
    
    [Column("alert_email")]
    public string alert_email { get; set; }
    
    [Column("api_key")]
    public string api_key { get; set; }
    
    [Column("rate_limit")]
    public int rate_limit { get; set; }
    
}