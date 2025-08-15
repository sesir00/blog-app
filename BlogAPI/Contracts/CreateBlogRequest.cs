// Contracts/CreateBlogRequest.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class CreateBlogRequest
    {
        [Required]
        [StringLength(300)]
        public string Title { get; set; }

        public string Content { get; set; }

        public bool IsPublished { get; set; } = true;
        
        // Image file will be handled separately in the controller
    }
}