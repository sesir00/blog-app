// Services/BlogService.cs
using AutoMapper;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

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

        public async Task<IEnumerable<BlogDto>> GetAllAsync()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Comments) // Include comments
                .ThenInclude(c => c.User) // if using UserName in CommentDto
                .ToListAsync();
            if (blogs == null || !blogs.Any())
            {
                throw new Exception("No blog posts found.");
            }
            var blogDtos = _mapper.Map<List<BlogDto>>(blogs);
            return blogDtos;
        }

        public async Task<BlogDto> GetByIdAsync(Guid id)
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
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating blog post with Id {id}.");
                throw;
            }
        }

        public async Task DeleteBlogAsync(Guid id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                throw new KeyNotFoundException($"Blog post with ID {id} not found.");
            }
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
        }
    }
}