namespace BlogAPI.Contracts
{
   public class CommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid BlogId { get; set; }
    public string UserName { get; set; } // 👈 Add this line

    }

}
