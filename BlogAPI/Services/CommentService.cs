using AutoMapper;
using BlogAPI.AppDataContext;
using BlogAPI.Contracts;
using BlogAPI.Interfaces;
using BlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing.Printing;

namespace BlogAPI.Services
{
    public class CommentService : ICommentService
    {
        private readonly BlogDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<CommentService> _logger;   //.NET DI knows how to provide ILogger<T>, but not the non-generic ILogger.The generic version tells the DI container what category name to use for logging.

        public CommentService(BlogDbContext context, IMapper mapper, ILogger<CommentService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }
        public async Task CreateCommentAsync(Guid BlogId, CreateCommentRequest request, int UserId)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == UserId))
            {
                throw new KeyNotFoundException($"User with ID {UserId} not found.");
            }
            if (!await _context.Blogs.AnyAsync(b => b.Id == BlogId))
            {
                throw new KeyNotFoundException($"Blog with ID {BlogId} not found.");
            }
            try
            {
                CommentModel comment = _mapper.Map<CommentModel>(request);
                comment.UserId = UserId;
                comment.BlogId = BlogId;
                comment.CreatedAt = DateTime.UtcNow;
                comment.UpdatedAt = DateTime.UtcNow;

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while creating comment for blog {BlogId} by user {UserId}");
                throw new Exception("A database error occurred while creating the comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating comment in blog {BlogId} by user {UserId}");
                throw; // Let the global exception handler take care
            }
        }

        public async Task UpdateCommentAsync(Guid CommentId, UpdateCommentRequest request, int UserId, bool IsAdmin)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == UserId))
            {
                throw new KeyNotFoundException($"User with ID {UserId} not found.");
            }
            if (!await _context.Comments.AnyAsync(c => c.Id == CommentId))
            {
                throw new KeyNotFoundException($"Comment with ID {CommentId} not found.");
            }

            try
            {
                var comment = await _context.Comments.FindAsync(CommentId);
                if (comment == null) 
                {
                    throw new KeyNotFoundException($"Comment  with ID {CommentId} not found.");
                }
                // Optional: Ownership check (security best practice)
                if (comment.UserId != UserId && !IsAdmin)
                {
                    throw new UnauthorizedAccessException("You are not authorized to update this comment.");
                }
                if(!String.IsNullOrWhiteSpace(request.Content))
                {
                    comment.Content = request.Content;
                }
                comment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Database error while updating comment ID {CommentId} by user {UserId}");
                throw new Exception("A database error occurred while updating the comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while updating comment ID {CommentId} by user {UserId}");
                throw;
            }
        }
        public async Task<bool> DeleteCommentAsync(Guid CommentId, int UserId, bool IsAdmin)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == UserId))
            {
                throw new KeyNotFoundException($"User with ID {UserId} not found.");
            }
            if (!await _context.Comments.AnyAsync(c => c.Id == CommentId))
            {
                throw new KeyNotFoundException($"Comment with ID {CommentId} not found.");
            }
            try
            {
                var comment = await _context.Comments.FindAsync(CommentId);
                if(comment == null)
                {
                    throw new KeyNotFoundException($"Comment  with ID {CommentId} not found.");
                }
                // Check authorization
                if (comment.UserId != UserId && !IsAdmin)
                {
                    throw new UnauthorizedAccessException("You are not authorized to delete this comment.");
                }
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync(); 
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Database error while deleting comment ID {CommentId} by user {UserId}");
                throw new Exception("A database error occurred while deleting the comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while deleting comment ID {CommentId} by user {UserId}");
                throw;
            }
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByBlogIdAsync(Guid BlogId)
        {
            try
            {
                var comment = await _context.Comments
                    .Where(c => c.BlogId == BlogId)
                    .Include(c => c.User)
                    .ToListAsync();
                if (!comment.Any())
                {
                    _logger.LogInformation($"No comments found for blog {BlogId}");
                }
                var commentDtos = _mapper.Map<IEnumerable<CommentDto>>(comment);
                return commentDtos;
                
            }
            catch (DbUpdateException dbex)
            {
                _logger.LogError(dbex, $"DB error while fetching comment for blog {BlogId}");
                throw new Exception("A database error occurred while fetching the comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unexpected error while fetching comment for blog {BlogId}.");
                throw;
            }
        }
    }
}
