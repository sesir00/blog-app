// Interfaces/IBlogService.cs
using BlogAPI.Contracts;
using BlogAPI.Models;

namespace BlogAPI.Interfaces
 {
     public interface IBlogService
     {
         Task<IEnumerable<Blog>> GetAllAsync();
         Task<Blog> GetByIdAsync(Guid id);
         Task CreateBlogAsync(CreateBlogRequest request, string? imagePath = null);
         Task UpdateBlogAsync(Guid id, UpdateBlogRequest request, string? ImageUrl = null);
         Task DeleteBlogAsync(Guid id);
     }
 }