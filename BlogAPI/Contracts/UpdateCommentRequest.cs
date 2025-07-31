using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Contracts
{
    public class UpdateCommentRequest
    {
        [StringLength(500)]
        public string Content { get; set; }
    }
}
