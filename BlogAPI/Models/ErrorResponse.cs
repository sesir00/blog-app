// Models/ErrorResponse.cs
namespace BlogAPI.Models
{
    public class ErrorResponse
    {
        public string Title { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public Dictionary<string, string[]>? Errors { get; set; }

    }
}