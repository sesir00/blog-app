using BlogAPI.Contracts;
using BlogAPI.Interfaces;

namespace BlogAPI.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ITokenService tokenService, IAuthService authService)
        {
            try
            {
                // Step 1: Get JWT from Authorization header
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

                // Step 2: Only validate if token exists
                if (!string.IsNullOrEmpty(token) && tokenService != null)
                {
                    // Validate JWT and extract userId
                    var userId = tokenService.ValidateJwtToken(token);

                    // Step 3: If valid token, attach user info to context.Items
                    if (userId != null && userId.HasValue)
                    {
                        // Attach user to context on successful JWT validation
                        var user = await authService.GetUserByIdAsync(userId.Value);
                        if (user != null)
                        {
                            context.Items["User"] = user;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception but don't stop the pipeline
                Console.WriteLine($"JWT Middleware Error: {ex.Message}");
                // Don't attach user to context if JWT validation fails
            }

            // Step 4: Continue to the next middleware/controller (always execute this)
            await _next(context);
        }
    }
}
//You can do:Why Use context.Items["User"]?
//This allows your application to access the authenticated user in controllers or other middleware without re-parsing the JWT again.

//You can do:
//    var user = HttpContext.Items["User"] as UserDto;

//constructor: Called once at startup, can only inject singleton/transient services
//Invoke method: Called per request, can inject scoped services because there's an active scope