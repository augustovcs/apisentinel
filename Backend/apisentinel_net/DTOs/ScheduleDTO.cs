namespace DTOs.Dev;

public class RequestScheduleDTO
{
    public long TestId { get; set; }
    public int IntervalSeconds { get; set; }
    public bool IsActive { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class ResponseScheduleDTO : RequestScheduleDTO
{
    public long Id { get; set; }
    public DateTime? LastExecutedAt { get; set; }
    public DateTime? NextExecutionAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? TestName { get; set; }
}

public class UpdateScheduleDTO
{
    public long Id { get; set; }
    public int IntervalSeconds { get; set; }
    public bool IsActive { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}
