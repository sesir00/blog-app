using BlogAPI.Enum;
using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class CreateUserRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 4)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [EnumDataType(typeof(UserRole))]
        public UserRole Role { get; set; } = UserRole.user;

        public bool IsActive { get; set; } = true;
    }

}
