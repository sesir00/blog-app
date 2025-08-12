// Interfaces/IBlogService.cs
using BlogAPI.Contracts;
using BlogAPI.Contracts.BlogAPI.Contracts;
using BlogAPI.Models;

namespace BlogAPI.Interfaces
 {
     public interface IBlogService
     {
         Task<PaginatedResponse<BlogDto>> GetAllAsync(int pageNumber, int pageSize);
         Task<BlogDto> GetByIdAsync(Guid id);
         Task CreateBlogAsync(CreateBlogRequest request, string? imagePath = null);
         Task UpdateBlogAsync(Guid id, UpdateBlogRequest request, string? ImageUrl = null);
         Task DeleteBlogAsync(Guid id);
        Task<List<BlogChartDto>> GetBlogAnalyticsAsync();

     }
}