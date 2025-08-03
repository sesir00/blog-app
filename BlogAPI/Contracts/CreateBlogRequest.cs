// Contracts/CreateBlogRequest.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class CreateBlogRequest
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Content { get; set; }

        public bool IsPublished { get; set; } = true;
        
        // Image file will be handled separately in the controller
    }
}