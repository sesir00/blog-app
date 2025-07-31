using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogAPI.Models
{
    public class CommentModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "Content cannot be longer than 500 characters.")]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Guid BlogId { get; set; }    //foreign key to BlogModel

        [ForeignKey("BlogId")]
        public Blog Blog { get; set; } = null!; // Navigation property to BlogModel
        //= null! is C#'s way of saying "this won't be null at runtime, trust me" to suppress nullability warnings.

        public int UserId { get; set; } // foreign key to UserModel

        [ForeignKey("UserId")]
        public UserModel User { get; set; } = null!; // Navigation property to UserModel
    }
}
