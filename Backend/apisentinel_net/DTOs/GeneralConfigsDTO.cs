// ─────────────────────────────────────────────
// DTOs/GeneralConfigsDTO.cs
// ─────────────────────────────────────────────
namespace General.DTOs;
 
public class GeneralConfigsDTO
{
    /// <example>1</example>
    public int Id { get; set; }
 
    /// <example>API Sentinel</example>
    public string plataform_name { get; set; }
 
    /// <example>30</example>
    public int default_timeout { get; set; }
 
    /// <example>America/Sao_Paulo</example>
    public string timezone { get; set; }
 
    /// <example>alerts@apisentinel.com</example>
    public string alert_email { get; set; }
 
    /// <example>sk-abc123xyz</example>
    public string api_key { get; set; }
 
    /// <example>100</example>
    public int rate_limit { get; set; }
}