// Models/Blog.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Models
{
    public class Blog
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [StringLength(300)]
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsPublished { get; set; }
        public string? ImageUrl { get; set; } // New property for image path or URL
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<CommentModel> Comments { get; set; } = new List<CommentModel>(); //Navigation property

        public Blog()
        {
            IsPublished = true;
        }
    }
}