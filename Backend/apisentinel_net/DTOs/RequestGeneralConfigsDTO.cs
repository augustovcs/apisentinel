// ─────────────────────────────────────────────
// DTOs/RequestGeneralConfigsDTO.cs
// ─────────────────────────────────────────────
namespace General.DTOs;
 
public class RequestGeneralConfigsDTO
{
    /// <example>API Sentinel</example>
    public string? plataform_name { get; set; }
 
    /// <example>30</example>
    public int? default_timeout { get; set; }
 
    /// <example>America/Sao_Paulo</example>
    public string? timezone { get; set; }
 
    /// <example>alerts@apisentinel.com</example>
    public string? alert_email { get; set; }
 
    /// <example>sk-abc123xyz</example>
    public string? api_key { get; set; }
 
    /// <example>100</example>
    public int? rate_limit { get; set; }
 
    /// <example>false</example>
    public bool? GenerateNewApiKey { get; set; }
}