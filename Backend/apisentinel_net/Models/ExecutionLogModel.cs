using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models.Dev
{
    [Table("execution_logs")]
    public class ExecutionLogModel : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("execution_id")]
        public long ExecutionId { get; set; }

        [Column("test_id")]
        public long TestId { get; set; }

        [Column("schedule_id")]
        public long? ScheduleId { get; set; }

        [Column("status")]
        public string Status { get; set; } // "processing", "success", "failed", "timeout"

        [Column("message")]
        public string? Message { get; set; }

        [Column("response_time")]
        public int? ResponseTime { get; set; }

        [Column("status_code")]
        public int? StatusCode { get; set; }

        [Column("error_details")]
        public Dictionary<string, object>? ErrorDetails { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("started_at")]
        public DateTime? StartedAt { get; set; }

        [Column("finished_at")]
        public DateTime? FinishedAt { get; set; }

        [Column("test_name")]
        public string? TestName { get; set; }

        [Column("url")]
        public string? Url { get; set; }

        [Column("method")]
        public string? Method { get; set; }
    }
}
