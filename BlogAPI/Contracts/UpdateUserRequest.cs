using BlogAPI.Enum;
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class UpdateUserRequest
    {
        [StringLength(50, MinimumLength = 4)]
        public string? UserName { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; }

        [EnumDataType(typeof(UserRole))]
        public UserRole? Role { get; set; }

        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool? IsActive { get; set; } 
    }
}
