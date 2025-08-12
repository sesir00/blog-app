// Controllers/BlogController.cs
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;         //your interface for blog operations like create, update, delete.
        private readonly IWebHostEnvironment _environment; //used to access the file system path like wwwroot for saving images.

        public BlogController(IBlogService blogService, IWebHostEnvironment environment)
        {
            _blogService = blogService;
            _environment = environment;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]

        public async Task<IActionResult> CreateBlogAsync([FromForm] CreateBlogRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? imagePath = null;
            if (image != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                imagePath = $"/images/{fileName}";
            }

            await _blogService.CreateBlogAsync(request, imagePath);
            return Ok(new { message = "Blog post created successfully." });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAsync([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var blogs = await _blogService.GetAllAsync(pageNumber, pageSize);
            return Ok(new
            {
                message = "Paginated blog posts retrieved successfully.",
                data = blogs.Data,
                pageNumber = blogs.PageNumber,
                pageSize = blogs.PageSize,
                totalCount = blogs.TotalCount,
                totalPages = blogs.TotalPages
            });
        }

        [HttpGet("{id:guid}")]
        //[AllowAnonymous]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            return Ok(new { message = $"Successfully retrieved blog post with Id {id}.", data = blog });
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateBlogAsync(Guid id, [FromForm] UpdateBlogRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            string? imagePath = null;
            if (image != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))//This code opens the file path and writes the uploaded image there
                {
                    await image.CopyToAsync(stream);
                }
                imagePath = $"/images/{fileName}";  //This is the path your frontend can use to show the image later
            }

            await _blogService.UpdateBlogAsync(id, request, imagePath);
            return Ok(new { message = $"Blog post with Id {id} updated successfully." });
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteBlogAsync(Guid id)
        {
            await _blogService.DeleteBlogAsync(id);
            return Ok(new { message = $"Blog post with Id {id} deleted successfully." });
        }

        [HttpGet("analytics/blogs")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetBlogAnalyticsAsync()
        {
            var blogAnalytics = await _blogService.GetBlogAnalyticsAsync();
            return Ok(new { message = $"Blog analyytics fetched successfully.", data = blogAnalytics });
        }
    }
}