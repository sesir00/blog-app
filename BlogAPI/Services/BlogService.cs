// Services/BlogService.cs
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;

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

        public async Task CreateBlogAsync(CreateBlogRequest request)
        {
            try
            {
                var blog = _mapper.Map<Blog>(request);
                blog.CreatedAt = DateTime.UtcNow;
                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post.");
                throw new Exception("Error creating blog post.");
            }
        }

        public async Task<IEnumerable<Blog>> GetAllAsync()
        {
            var blogs = await _context.Blogs.ToListAsync();
            if (blogs == null || !blogs.Any())
            {
                throw new Exception("No blog posts found.");
            }
            return blogs;
        }

        public async Task<Blog> GetByIdAsync(Guid id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                throw new KeyNotFoundException($"No blog post with Id {id} found.");
            }
            return blog;
        }

        public async Task UpdateBlogAsync(Guid id, UpdateBlogRequest request)
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
                throw new Exception($"No blog post with Id {id} found.");
            }
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
        }
    }
}