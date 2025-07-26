using BlogAPI.Models;

namespace BlogAPI.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(UserModel user);
        int? ValidateJwtToken(string token);
    }
}
