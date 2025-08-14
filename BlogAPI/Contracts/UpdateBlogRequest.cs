// Contracts/UpdateBlogRequest.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class UpdateBlogRequest
    {
        [StringLength(300)]
        public string Title { get; set; }

        public string Content { get; set; }

        public bool? IsPublished { get; set; }
    }
}