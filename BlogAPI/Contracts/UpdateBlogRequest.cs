// Contracts/UpdateBlogRequest.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class UpdateBlogRequest
    {
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Content { get; set; }

        public bool? IsPublished { get; set; }
    }
}