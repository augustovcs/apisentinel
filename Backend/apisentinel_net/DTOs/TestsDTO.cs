// ─────────────────────────────────────────────
// DTOs/Dev/TestsDTO.cs
// ─────────────────────────────────────────────
namespace DTOs.Dev;
 
public class RequestTestsDTO
{
    /// <example>Auth Login Test</example>
    public string? Name { get; set; }
 
    /// <example>https://api.exemplo.com/login</example>
    public string? Url { get; set; }
 
    /// <example>POST</example>
    public string? Method { get; set; }
 
    /// <example>{"Authorization": "Bearer token123", "Content-Type": "application/json"}</example>
    public Dictionary<string, object>? Headers { get; set; }
 
    /// <example>{"username": "admin", "password": "123456"}</example>
    public Dictionary<string, object>? Body { get; set; }
 
    /// <example>200</example>
    public int? ExpectedStatusCode { get; set; }
 
    /// <example>3000</example>
    public int? MaxResponseTime { get; set; }
 
    /// <example>success</example>
    public string? LastStatus { get; set; }
}
 
public class RequestUpdateTestsDTO : RequestTestsDTO
{
    /// <example>1</example>
    public long Id;
 
    /// <example>2024-01-15T10:30:00</example>
    public DateTime? CreatedAt { get; set; }
 
    /// <example>2024-06-01T08:00:00</example>
    public DateTime? UpdatedAt { get; set; }
}
 
public class TestsDTO : RequestTestsDTO
{
    /// <example>1</example>
    public long Id { get; set; }
 
    /// <example>2024-01-15T10:30:00</example>
    public DateTime? CreatedAt { get; set; }
 
    /// <example>2024-06-01T08:00:00</example>
    public DateTime? UpdatedAt { get; set; }
}