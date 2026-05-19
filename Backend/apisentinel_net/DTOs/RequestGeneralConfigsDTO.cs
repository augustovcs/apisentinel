namespace General.DTOs;

public class RequestGeneralConfigsDTO
{
    public string? plataform_name { get; set; }
    
    public int? default_timeout { get; set; }
    
    public string? timezone { get; set; }
    
    public string? alert_email { get; set; }
    
    public string? api_key { get; set; }
    
    public int? rate_limit { get; set; }
    
    public bool? GenerateNewApiKey { get; set; }
}