using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]    //Restrict all endpoints to admins
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/User?pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<IActionResult> GetAllUsersAsync([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var users = await _userService.GetAllUsersAsync(pageNumber, pageSize);
            return Ok(new
            {
                message = "Paginated users retrieved successfully.",
                data = users.Data,
                pageNumber = users.PageNumber,
                pageSize = users.PageSize,
                totalCount = users.TotalCount,
                totalPages = users.TotalPages
            });
        }

        //POST: api/user
        [HttpPost]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserDto user = await _userService.CreateUserAsync(request);

            var response = new
            {
                message = "User created successfully!",
                user
            };
            return Ok(response);
        }

        // PUT: api/user/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUserAsync(int id, [FromBody] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _userService.UpdateUserAsync(id, request);
            return Ok(new
            {
                message = "User updated successfully"
            });
        }

        // DELETE: api/user/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUserAsync(int id)
        {
            await _userService.DeleteUserAsync(id);
            return Ok(new
            {
                message = "User deleted successfully"
            });
        }

        // GET: api/user/analytics/roles
        [HttpGet("analytics/roles")]
        public async Task<IActionResult> GetUserRoleAnalyticsAsync()
        {
            var result = await _userService.GetUserRoleAnalyticsAsync();
            return Ok(new
            {
                message = "User role analytics retrieved successfully.",
                data = result
            });
        }

    }
}
