using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using BlogAPI.Enum;
namespace BlogAPI.Models
{
    //
    public class UserModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty; // Username is unique and required

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;   //to silence this warning without turning the property into a nullable string (string?), you do this


        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string HashPassword { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public UserRole Role { get; set; }  // "Admin" or "User"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
