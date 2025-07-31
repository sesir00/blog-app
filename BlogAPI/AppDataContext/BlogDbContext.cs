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
        public DbSet<CommentModel> Comments { get; set; }

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

            modelBuilder.Entity<CommentModel>()
                .ToTable("Comments")
                .HasKey(c => c.Id);

            modelBuilder.Entity<CommentModel>()
                .HasOne(c => c.Blog)
                .WithMany(b => b.Comments) // Assuming Blog has a collection of Comments
                .HasForeignKey(c => c.BlogId)
                .OnDelete(DeleteBehavior.Cascade);  //If a Blog is deleted, its related Comments will be deleted automatically (cascade delete).

            modelBuilder.Entity<CommentModel>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c =>c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
