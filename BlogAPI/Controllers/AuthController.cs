using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task <ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize]     // Requires any authenticated user
        public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }


        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // With JWT, logout is handled on the client side by removing the token
            // You could implement a token blacklist here if needed
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
