// AppDataContext/BlogDbContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using BlogAPI.Models;

namespace BlogAPI.AppDataContext
{
    public class BlogDbContext : DbContext
    {
        private readonly DbSettings _dbSettings;

        public BlogDbContext(IOptions<DbSettings> dbSettings)
        {
            _dbSettings = dbSettings.Value;
        }

        public DbSet<Blog> Blogs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_dbSettings.ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blog>()
                .ToTable("Blogs")
                .HasKey(x => x.Id);
        }
    }
}