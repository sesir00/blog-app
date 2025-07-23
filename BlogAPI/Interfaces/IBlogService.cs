// Interfaces/IBlogService.cs
using BlogAPI.Contracts;
using BlogAPI.Models;

namespace BlogAPI.Interfaces
 {
     public interface IBlogService
     {
         Task<IEnumerable<Blog>> GetAllAsync();
         Task<Blog> GetByIdAsync(Guid id);
         Task CreateBlogAsync(CreateBlogRequest request);
         Task UpdateBlogAsync(Guid id, UpdateBlogRequest request);
         Task DeleteBlogAsync(Guid id);
     }
 }