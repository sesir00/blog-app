using BlogAPI.AppDataContext;
using BlogAPI.Enum;
using BlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogAPI.Seeding;

public static class AdminSeeder
{
        public static async Task SeedAdminAsync(IServiceProvider services, IConfiguration config)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                // Read from environment variables / appsettings
                var adminEmail = config["AdminSeed:Email"];
                var adminUsername = config["AdminSeed:UserName"];
                var adminPassword = config["AdminSeed:Password"];

                if (string.IsNullOrEmpty(adminEmail) ||
                    string.IsNullOrEmpty(adminUsername) ||
                    string.IsNullOrEmpty(adminPassword))
                {
                    logger.LogWarning("AdminSeed config missing. Skipping admin seeding.");
                    return;
                }

                // Check if admin already exists
                var exists = await db.Users.AnyAsync(u =>
                    u.Email.ToLower() == adminEmail.ToLower() ||
                    u.UserName.ToLower() == adminUsername.ToLower());

                if (exists)
                {
                    logger.LogInformation("Admin user already exists. Skipping seeding.");
                    return;
                }

                var admin = new UserModel
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                    HashPassword = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = UserRole.admin,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                db.Users.Add(admin);
                await db.SaveChangesAsync();

                logger.LogInformation("✅ Admin user seeded successfully: {Email}", adminEmail);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Failed to seed admin user.");
                throw;
            }
        }
}
