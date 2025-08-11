using AutoMapper;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogAPI.Services
{
    public class UserService: IUserService
    {
        private readonly BlogDbContext _context;
        private readonly ILogger<UserService> _logger;
        private readonly IMapper _mapper;
        public UserService(BlogDbContext context, ILogger<UserService> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }
        public async Task<PaginatedResponse<UserDto>> GetAllUsersAsync(int pageNumber, int pageSize)
        {
         
                var query = _context.Users
                    .AsQueryable();

                var totalCount = await query.CountAsync();

                var users = await query
                    .OrderBy(u => u.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                if (users == null || !users.Any())
                {
                    _logger.LogInformation($"No users found for page {pageNumber}");
                }

                var userDtos = _mapper.Map<List<UserDto>>(users);

                return new PaginatedResponse<UserDto>
                {
                    Data = userDtos,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalCount
                };
        
        }

        public async Task UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if(user == null)
                {
                    throw new Exception($"User with Id {userId} not found.");
                }

                if (!string.IsNullOrWhiteSpace(request.UserName))
                    user.UserName = request.UserName;
                if (!string.IsNullOrWhiteSpace(request.Email))
                    user.Email = request.Email;
                if (!string.IsNullOrWhiteSpace(request.Password))
                    user.HashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
                if (request.Role.HasValue)
                    user.Role = request.Role.Value;
                if (request.IsActive.HasValue)
                    user.IsActive = request.IsActive.Value;

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while updating user with Id {userId}.");
                throw new Exception("A database error occurred while updating the user.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user with Id {userId}.");
                throw;
            }
        }
        public async Task DeleteUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new KeyNotFoundException($"User with ID {userId} not found.");
                }
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while deleting user with Id {userId}.");
                throw new Exception("A database error occurred while deleting the user.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting user with Id {userId}.");
                throw;
            }

        }
        
        public async Task<UserDto> CreateUserAsync( CreateUserRequest request)
        {
            //checked if user already exists
            if (await _context.Users
                .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower() || u.UserName.ToLower() == request.UserName.ToLower()))
            {
                throw new BadHttpRequestException("User with this username or email already exists.");
            }
            try
            {
                //Create new user
                var user = new UserModel()
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    HashPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = request.Role,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,    // IsActive = request.IsActive
                };

                //var user = _mapper.Map<UserModel>(registerRequest);       //This is the bad way
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Map to DTO and return
                return _mapper.Map<UserDto>(user);
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while creating user.");
                throw new Exception("A database error occurred while creating the user.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to register user with username: {Username}", request.UserName);
                throw;
            }
        }


    }
}
