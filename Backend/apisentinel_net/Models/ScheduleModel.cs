using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models.Dev
{
    [Table("schedules")]
    public class ScheduleModel : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("test_id")]
        public long TestId { get; set; }

        [Column("interval_seconds")]
        public int? IntervalSeconds { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("last_executed_at")]
        public DateTime? LastExecutedAt { get; set; }

        [Column("next_execution_at")]
        public DateTime? NextExecutionAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("description")]
        public string? Description { get; set; }
    }
}
