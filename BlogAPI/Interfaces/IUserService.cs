using BlogAPI.Contracts;

namespace BlogAPI.Interfaces
{
    public interface IUserService
    {
        Task<PaginatedResponse<UserDto>> GetAllUsersAsync(int pageNumber, int pageSize);
        Task UpdateUserAsync(int userId,UpdateUserRequest request);
        Task DeleteUserAsync(int userId);
        Task<UserDto> CreateUserAsync(CreateUserRequest request);
        Task<List<RoleChartDto>> GetUserRoleAnalyticsAsync();

    }
}
