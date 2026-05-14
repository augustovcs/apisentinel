using Newtonsoft.Json.Linq;

namespace DTOs.Dev;

    public class TestsDTO
    {
        //public long Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Method { get; set; }
        public Dictionary<string, object> Headers { get; set; }
        public Dictionary<string, object> Body { get; set; }
        public int? ExpectedStatusCode { get; set; }
        public int? MaxResponseTime { get; set; }
        public string? LastStatus { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

