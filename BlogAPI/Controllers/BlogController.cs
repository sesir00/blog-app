// Controllers/BlogController.cs
using Microsoft.AspNetCore.Mvc;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;

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

            try
            {
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating blog post.", error = ex.Message });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var blogs = await _blogService.GetAllAsync();
                return Ok(new { message = "Successfully retrieved all blog posts.", data = blogs });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "No blog posts found.", error = ex.Message });
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            try
            {
                var blog = await _blogService.GetByIdAsync(id);
                return Ok(new { message = $"Successfully retrieved blog post with Id {id}.", data = blog });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving blog post with Id {id}.", error = ex.Message });
            }
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "admin")]

        public async Task<IActionResult> UpdateBlogAsync(Guid id, [FromForm] UpdateBlogRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating blog post with Id {id}.", error = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteBlogAsync(Guid id)
        {
            try
            {
                await _blogService.DeleteBlogAsync(id);
                return Ok(new { message = $"Blog post with Id {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error deleting blog post with Id {id}.", error = ex.Message });
            }
        }
    }
}