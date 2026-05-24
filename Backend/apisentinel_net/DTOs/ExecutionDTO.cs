namespace DTOs.Dev
{
    public class ExecutionDTO
    {
        public long Id { get; set; }

        public long TestId { get; set; }

        public string? Status { get; set; }

        public int? ResponseTime { get; set; }

        public int? StatusCode { get; set; }

        public string? Error { get; set; }

        public DateTime? ExecutedAt { get; set; }
    }
}