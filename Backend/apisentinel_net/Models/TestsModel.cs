using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json;

namespace Models.Dev
{
    [Table("tests")]
    public class TestsModel : BaseModel
    {
        [PrimaryKey("id")]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("url")]
        public string? Url { get; set; }

        [Column("method")]
        public string? Method { get; set; }

        [Column("headers")]
        public JsonDocument? Headers { get; set; }

        [Column("body")]
        public JsonDocument? Body { get; set; }

        [Column("expectedstatuscode")]
        public int? ExpectedStatusCode { get; set; }

        [Column("maxresponsetime")]
        public int? MaxResponseTime { get; set; }

        [Column("laststatus")]
        public string? LastStatus { get; set; }

        [Column("createdat")]
        public DateTime? CreatedAt { get; set; }

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }
}