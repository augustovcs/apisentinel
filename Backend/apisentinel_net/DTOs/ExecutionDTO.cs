namespace DTOs.Dev;

public class RequestExecutionDTO
{
    public long TestId { get; set; }
}

public class ResponseExecutionDTO : RequestExecutionDTO
{
    public long Id { get; set; }

    public string? TestName { get; set; }

    public string? Status { get; set; }

    public int? ResponseTime { get; set; }

    public int? StatusCode { get; set; }

    public string? Error { get; set; }

    public DateTime? ExecutedAt { get; set; }

    public string? Url { get; set; }

    public string? Method { get; set; }

    public Dictionary<string, object>? RequestHeaders { get; set; }

    public Dictionary<string, object>? RequestBody { get; set; }

    public int? ExpectedStatusCode { get; set; }

    public int? MaxResponseTime { get; set; }

    public string? TestLastStatus { get; set; }

    public DateTime? TestCreatedAt { get; set; }

    public DateTime? TestUpdatedAt { get; set; }
}

