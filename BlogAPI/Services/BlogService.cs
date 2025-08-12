// Services/BlogService.cs
using AutoMapper;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Contracts.BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.Design;
using System.Globalization;
using System.Reflection.Metadata;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BlogAPI.Services
{
    public class BlogService : IBlogService
    {
        private readonly BlogDbContext _context;
        private readonly ILogger<BlogService> _logger;
        private readonly IMapper _mapper;

        public BlogService(BlogDbContext context, ILogger<BlogService> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task CreateBlogAsync(CreateBlogRequest request, string? imagePath = null)
        {
            try
            {
                Blog blog = _mapper.Map<Blog>(request);
                blog.CreatedAt = DateTime.UtcNow;
                blog.ImageUrl = imagePath;
                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while creating blog post by user.");
                throw new Exception("A database error occurred while creating the blog post.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating blog post by user.");
                throw; // Let the global exception handler take care
            }
        }

        public async Task<PaginatedResponse<BlogDto>> GetAllAsync(int pageNumber, int pageSize)
        {
            try
            {
                var query = _context.Blogs
                    .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                    .AsQueryable();

                var totalCount = await query.CountAsync();

                var blogs = await query
                    .OrderByDescending(b => b.CreatedAt)
                    .Skip((pageNumber -1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                if (blogs == null || !blogs.Any())
                {
                    throw new Exception("No blog posts found.");
                }
                var blogDtos = _mapper.Map<List<BlogDto>>(blogs);
                return new PaginatedResponse<BlogDto>
                {
                    Data = blogDtos,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalCount
                };
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while fetching paginated blog post.");
                throw new Exception("A database error occurred while fetching paginated blog post.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching paginated blog post by user.");
                throw; 
            }
            
        }

        public async Task<BlogDto> GetByIdAsync(Guid id)
        {
            try
            {
                var blog = await _context.Blogs
                .Include(b => b.Comments) // Include comments
                .ThenInclude(c => c.User) // if using UserName in CommentDto
                .FirstOrDefaultAsync(b => b.Id == id);
                if (blog == null)
                {
                    throw new KeyNotFoundException($"No blog post with Id {id} found.");
                }
                var blogDto = _mapper.Map<BlogDto>(blog);
                return blogDto;
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while fetching blog post by ID.");
                throw new Exception("A database error occurred while fetching the blog post by ID.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching blog post by ID.");
                throw; 
            }
            
        }

        public async Task UpdateBlogAsync(Guid id, UpdateBlogRequest request, string? imagePath = null)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null)
                {
                    throw new Exception($"Blog post with Id {id} not found.");
                }

                if (request.Title != null)
                    blog.Title = request.Title;
                if (request.Content != null)
                    blog.Content = request.Content;
                if (request.IsPublished != null)
                    blog.IsPublished = request.IsPublished.Value;
                if (imagePath != null)
                    blog.ImageUrl = imagePath;                      //update image if provided.

                blog.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while updating blog post by user.");
                throw new Exception("A database error occurred while updating the blog post.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating blog post with Id {id}.");
                throw;
            }
        }

        public async Task DeleteBlogAsync(Guid id)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null)
                {
                    throw new KeyNotFoundException($"Blog post with ID {id} not found.");
                }
                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while deleting blog post by user.");
                throw new Exception("A database error occurred while deleting the blog post.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting blog post by user.");
                throw;
            }
            
        }

        public async Task<List<BlogChartDto>> GetBlogAnalyticsAsync()
        {
            try
            {
                var now = DateTime.UtcNow;

                // Step 1: Get blog counts for the last 6 months
                var monthlyData = await _context.Blogs      //You take all blog posts in the database.
                    .Where(b => b.CreatedAt >= now.AddMonths(-5).Date)  // last 6 months including current
                    .GroupBy(b => new { b.CreatedAt.Year, b.CreatedAt.Month})        //You group them by the month number of their creation date (1 = January, 2 = February, etc.).
                    .Select(g => new BlogChartDto   
                    {                               
                        Name = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month),   //For each group (g), get the month name from the number (g.Key).
                        Posts = g.Count()                                                       //Count how many blog posts are in that month.
                    })
                    .ToListAsync(); // Materialize first


                // Step 2: Build list of last 6 months (with zero counts if missing)
                var result = Enumerable.Range(0, 6) //Loops through the last 6 months (including current month).
                    .Select(i =>
                    {
                        var date = now.AddMonths(-i);
                        var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(date.Month);
                        return new BlogChartDto
                        {
                            Name = monthName,
                            Posts = monthlyData.FirstOrDefault(m => m.Name == monthName)?.Posts ?? 0    //If a month doesn’t exist in the query results, it’s filled with 0.
                        };
                    })
                    .OrderBy(dto => DateTime.ParseExact(dto.Name, "MMMM", CultureInfo.CurrentCulture).Month)  //You sort the list in month order (January → December).
                    .ToList();      //This is done in memory, after fetching the results.

                return result;
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, "DB error while fetching blog analytic data.");
                throw new Exception("A database error occurred while fetching blog analytic data.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch blog analytic data.");
                throw;
            }
        }
    }
}