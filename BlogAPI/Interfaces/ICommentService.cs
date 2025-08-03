using BlogAPI.Contracts;
using BlogAPI.Models;

namespace BlogAPI.Interfaces
{
    public interface ICommentService
    {
        Task CreateCommentAsync(Guid BlogId, CreateCommentRequest request, int UserId);
        Task UpdateCommentAsync(Guid CommentId, UpdateCommentRequest request, int UserId, bool IsAdmin);
        Task<bool> DeleteCommentAsync(Guid CommentId, int UserId, bool IsAdmin);
        Task<IEnumerable<CommentDto>> GetCommentsByBlogIdAsync(Guid BlogId);
    }
}
