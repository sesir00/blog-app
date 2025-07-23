// Controllers/BlogController.cs
using Microsoft.AspNetCore.Mvc;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlogAsync(CreateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _blogService.CreateBlogAsync(request);
                return Ok(new { message = "Blog post created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating blog post.", error = ex.Message });
            }
        }

        [HttpGet]
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
        public async Task<IActionResult> UpdateBlogAsync(Guid id, UpdateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _blogService.UpdateBlogAsync(id, request);
                return Ok(new { message = $"Blog post with Id {id} updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating blog post with Id {id}.", error = ex.Message });
            }
        }

        [HttpDelete("{id:guid}")]
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