// Models/Blog.cs
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Models
{
    public class Blog
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [StringLength(1000)]
        public string Content { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Blog()
        {
            IsPublished = false;
        }
    }
}