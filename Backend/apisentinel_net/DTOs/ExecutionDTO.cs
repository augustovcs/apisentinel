namespace DTOs.Dev;

public class RequestExecutionDTO
{
    public long TestId { get; set; }
}

public class ResponseExecutionDTO : RequestExecutionDTO
{
    public long Id { get; set; }

    public string? Status { get; set; }

    public int? ResponseTime { get; set; }

    public int? StatusCode { get; set; }

    public string? Error { get; set; }

    public DateTime? ExecutedAt { get; set; }
}

