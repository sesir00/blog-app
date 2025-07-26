using AutoMapper;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Middleware;
using BlogAPI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace BlogAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly BlogDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public object ModelState { get; private set; }

        public AuthService(BlogDbContext context, ITokenService tokenService, ILogger<AuthService> logger, IMapper mapper, IConfiguration config)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
            _mapper = mapper;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            //checked if user already exists
            if(await UserExistsAsync(registerDto.Email, registerDto.Username))
            {
                throw new BadHttpRequestException("User with this username or email already exists.");
            }
            try
            {
                //Create new user
                var user = new UserModel()
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    HashPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    Role = Enum.UserRole.user,   //Default role
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };  

                //var user = _mapper.Map<UserModel>(registerRequest);       //This is the bad way
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                //Generate Jwt token
                string token = _tokenService.GenerateJwtToken(user);
                UserDto userDto = _mapper.Map<UserDto>(user);

                return new AuthResponseDto
                {
                    Token = token,
                    User = userDto,
                    ExpiresAt = DateTime.UtcNow.AddDays(_config.GetValue<int>("JwtSettings:ExpiryDays"))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to register user with username: {Username}", registerDto.Username);
                throw new ApplicationException("Error creating user");
            }
        }
        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Username) || string.IsNullOrEmpty(loginDto.Password))
            {
                throw new BadHttpRequestException("Username or Password cannot be empty or whitespace.");
            }
            try
            {
                //find user by unique username 
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username);
                if (user == null || !user.IsActive) 
                {
                    throw new UnauthorizedAccessException("Invalid Credentials!!"); 
                }
                //verify password
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.HashPassword))
                {
                    throw new UnauthorizedAccessException("Invalid Credentials!!");
                }

                //Generate Jwt tokens
                var token = _tokenService.GenerateJwtToken(user);
                UserDto userDto = _mapper.Map<UserDto>(user);

                return new AuthResponseDto
                {
                    Token = token,
                    User = userDto,
                    ExpiresAt = DateTime.UtcNow.AddDays(_config.GetValue<int>("JwtSettings:ExpiryDays"))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to login user with username " + loginDto.Username);
                throw new Exception("Error while user login");
            }
        }
        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
            return user != null ? _mapper.Map<UserDto>(user) : null;
        }
        public async Task<bool> UserExistsAsync(string email, string username)
        {
            return await _context.Users
                .AnyAsync(u => u.Email == email.ToLower() || u.UserName == username);
        }
    }
}
