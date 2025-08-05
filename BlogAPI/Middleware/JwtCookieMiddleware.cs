using BlogAPI.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Middleware
{
    public class JwtCookieMiddleware
    {
        private readonly RequestDelegate _next;
        public JwtCookieMiddleware(RequestDelegate next) => _next = next;

        public async Task Invoke(HttpContext context)
        {
            var jwt = context.Request.Cookies["jwt"];
            if (!string.IsNullOrEmpty(jwt))
            {
                context.Request.Headers["Authorization"] = $"Bearer {jwt}";
            }

            await _next(context);
        }
    }

}
//JwtCookieMiddleware
//Reads the JWT from an HttpOnly cookie and attaches it to the request as a Bearer token so that downstream middleware 
//(like JWT auth) can use it.

//JwtMiddleware
//Validates the JWT, and if valid, loads the user from the DB and attaches it to HttpContext.Items["User"] for easy access
//in controllers.Validates the JWT, and if valid, loads the user from the DB and attaches it to HttpContext.Items["User"]
//for easy access in controllers.