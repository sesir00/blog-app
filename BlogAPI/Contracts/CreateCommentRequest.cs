using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class CreateCommentRequest
    {
        [Required]
        [StringLength(500)]
        public string Content { get; set; }
    }
}
