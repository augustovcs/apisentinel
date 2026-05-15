using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using Newtonsoft.Json.Linq;

namespace Models.Dev
{
    [Table("tests")]
    public class TestsModel : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("url")]
        public string? Url { get; set; }

        [Column("method")]
        public string? Method { get; set; }

        [Column("headers")]
        public Dictionary<string, object> Headers { get; set; }

        [Column("body")]
        public Dictionary<string, object> Body { get; set; }

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