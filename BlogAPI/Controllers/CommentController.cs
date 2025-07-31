using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Numerics;
using System.Reflection.Metadata;
using System.Security.Claims;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpPost("blog/{blogId:guid}")]
        [Authorize] // Require authentication
        public async Task<IActionResult> CreateCommentAsync(Guid blogId, [FromBody] CreateCommentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Invalid user token.");
            }
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }
            try
            {
                await _commentService.CreateCommentAsync(blogId, request, userId);
                return Ok(new { message = "Comment created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating comment.", error = ex.Message });
            }
        }

        [HttpPut("{commentId:guid}")]
        [Authorize]
        public async Task<IActionResult> UpdateCommentAsync(Guid commentId, [FromBody] UpdateCommentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Invalid user token.");
            }
            bool isAdmin = IsUserAdmin();
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }
            try
            {
                await _commentService.UpdateCommentAsync(commentId, request, userId, isAdmin);
                return Ok(new { message = "Comment updated successfully." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You are not authorized to update this comment.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating comment.", error = ex.Message });
            }
        }

        [HttpDelete("{commentId:guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteCommentAsync(Guid commentId)
        {
            //For a DELETE endpoint with just a GUID parameter, ModelState validation isn't needed since there's no complex request body to validate.

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Invalid user token.");
            }
            bool isAdmin = IsUserAdmin();
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Invalid user ID format." });
            }

            try
            {
                bool isDeleted = await _commentService.DeleteCommentAsync(commentId, userId, isAdmin);
                if (isDeleted)
                {
                    return Ok(new { message = "Comment deleted successfully." });
                }

                return NotFound(new { message = "Comment not found or you don't have permission to delete it." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You are not authorized to delete this comment.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting comment.", error = ex.Message });
            }
        }

        [HttpGet("blog/{blogId:guid}")]
        public async Task<IActionResult> GetCommentsByBlogIdAsync(Guid blogId)
        {
            try
            {
                var comments = await _commentService.GetCommentsByBlogIdAsync(blogId);
                return Ok(new { message = $"Successfully retrieved comments for blog post with Id {blogId}.", data = comments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving comments for blog post with Id {blogId}.", error = ex.Message });
            }
        }

        private bool IsUserAdmin()
        {
            var userRoleClaim = User.FindFirstValue(ClaimTypes.Role);
            return string.Equals(userRoleClaim, "Admin", StringComparison.OrdinalIgnoreCase);
        }
    }
}
