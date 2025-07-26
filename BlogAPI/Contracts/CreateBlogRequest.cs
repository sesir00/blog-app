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

        [Required]
        public bool IsPublished { get; set; }
        
        // Image file will be handled separately in the controller
    }
}