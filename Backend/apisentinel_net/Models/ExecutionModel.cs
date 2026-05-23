using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Models.Dev
{
    [Table("executions")]
    public class ExecutionModel : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("testid")]
        public long TestId { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("responsetime")]
        public int? ResponseTime { get; set; }

        [Column("statuscode")]
        public int? StatusCode { get; set; }

        [Column("error")]
        public string? Error { get; set; }

        [Column("executed_at")]
        public DateTime? ExecutedAt { get; set; }
    }
}