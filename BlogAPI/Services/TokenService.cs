using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        // 🔐 1. Generate a signed JWT token for the user after login
        public string GenerateJwtToken(UserModel user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Secret key used to sign the token (must be kept safe)
            var key = Encoding.ASCII.GetBytes(
                _config["JwtSettings:Key"]
                ?? throw new InvalidOperationException("JWT Secret Key not found")
            );

            // 👤 User-related information embedded into the token (called "claims")
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.ToString()) // "User" or "Admin"
            };

            // 📜 Token settings and security configuration
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // ⏳ Token expires in 1 day
                Issuer = _config["JwtSettings:Issuer"],       // 🏷 Issuer (who issued the token)
                Audience = _config["JwtSettings:Audience"],   // 🎯 Audience (who it's for)
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature // 🖊 Token is signed with HMAC SHA-256
                )
            };

            // 🛠️ Create and return the token string
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // ✅ 2. Validate the JWT token from incoming request
        public int? ValidateJwtToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();

            // Load secret key to verify token signature
            var key = Encoding.ASCII.GetBytes(
                _config["JwtSettings:Key"]
                ?? throw new InvalidOperationException("JWT Secret Key not found")
            );

            try
            {
                // 📌 Token validation settings
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),

                    ValidateIssuer = true,
                    ValidIssuer = _config["JwtSettings:Issuer"],

                    ValidateAudience = true,
                    ValidAudience = _config["JwtSettings:Audience"],

                    ValidateLifetime = true, // ⏳ Make sure token is not expired
                    ClockSkew = TimeSpan.Zero // ⏰ No time skew allowed
                }, out SecurityToken validatedToken);

                // 🔍 Extract user ID from validated token
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims
                    .FirstOrDefault(x => x.Type == "nameid")?.Value ?? "0");

                return userId; // 🆔 Return user ID for further processing (e.g. find user in DB)
            }
            catch
            {
                // ❌ Token invalid (expired, tampered, or wrong signature)
                return null;
            }
        }
    }
}
