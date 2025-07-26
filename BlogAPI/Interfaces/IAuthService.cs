using BlogAPI.Contracts;

namespace BlogAPI.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerRequest);
        Task<AuthResponseDto> LoginAsync(LoginDto loginRequest);
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<bool> UserExistsAsync(string email, string username);
    }
}
