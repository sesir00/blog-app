using BlogAPI.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Net;

//IExceptionHandler is the built -in interface for centralized exception handling.
//All unhandled exceptions in controllers / services are routed through this class.

namespace BlogAPI.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(            //This interface requires the method: TryHandleAsync(...)
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            // Log full stack trace for debugging
            _logger.LogError(exception, "Unhandled exception occurred.");

            var errorResponse = new ErrorResponse
            {
                Title = exception.GetType().Name,
                Message = exception.Message
            };

            switch (exception)
            {
                case BadHttpRequestException:
                    errorResponse.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Title = exception.GetType().Name;
                    break;
                case UnauthorizedAccessException:
                    errorResponse.StatusCode = (int)HttpStatusCode.Unauthorized;
                    break;
                case KeyNotFoundException:
                    errorResponse.StatusCode = (int)HttpStatusCode.NotFound;
                    break;
                default:
                    errorResponse.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Title = "Internal Server Error";
                    break;
            }

            // Special case: ModelState errors
            if (exception is ValidationException validationEx)
            {
                errorResponse.Title = "Validation Error";
                errorResponse.Errors = new Dictionary<string, string[]>
                {
                    { "ValidationErrors", new[] { validationEx.Message } }
                };
            }

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = errorResponse.StatusCode;

            await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);
            return true;
        }
    }
}