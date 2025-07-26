// BlogDbContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using BlogAPI.Models;

namespace BlogAPI.AppDataContext
{
    public class BlogDbContext : DbContext
    {
        //private readonly string _connectionString;

        //// Constructor used by the app
        //public BlogDbContext(IOptions<DbSettings> dbSettings)
        //{
        //    _connectionString = dbSettings.Value.ConnectionString;
        //}

        // Constructor used by EF CLI
        public BlogDbContext(DbContextOptions<BlogDbContext> options)
            : base(options)
        {
        }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<UserModel> Users { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured && !string.IsNullOrEmpty(_connectionString))
        //    {
        //        optionsBuilder.UseSqlServer(_connectionString);
        //    }
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Required for Identity tables
            
            modelBuilder.Entity<Blog>()
                .ToTable("Blogs")
                .HasKey(x => x.Id);

            modelBuilder.Entity<Blog>()
                .Property(x => x.ImageUrl)
                .IsRequired(false);


            // Configure enum as string                                                 
            //modelBuilder.Entity<UserModel>()
                //.Property(u => u.Role)
                //.HasConversion<string>()
                //.HasMaxLength(20);
        }
    }
}
