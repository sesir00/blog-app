using BlogAPI.AppDataContext;
using BlogAPI.Interfaces;
using BlogAPI.Middleware;
using BlogAPI.Seeding;
using BlogAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Core Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Blog API", Version = "v1" });

    // 🔐 Add JWT Bearer Auth
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {your token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
}); builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// 2. Configure DbContext
var connectionString = builder.Configuration.GetSection("DbSettings")["ConnectionString"];

builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseMySql(
        connectionString,
                //ServerVersion.AutoDetect(connectionString)
                new MySqlServerVersion(new Version(8, 0, 0))
    ));


// 3. Configure Identity`
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<BlogDbContext>()
    .AddDefaultTokenProviders();

// 4. Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]))
    };

    // 👇 Add this block to read token from cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["jwt"]; 
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

// 5. Add Custom Services
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IUserService, UserService>();

// 6. Configure Exception Handling and Logging
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddLogging();

// 7. Authorization Policies
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
//    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
//});

// 8. CORS (for React frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", 
            "https://localhost:5173", // Add HTTPS variant
            "http://ballertalks.com/", 
            "https://ballertalks.com/",
            "http://ballertalks-001-site1.mtempurl.com",   // 👈 temporary URL
            "https://ballertalks-001-site1.mtempurl.com"   // 👈 HTTPS variant
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// This code creates a service scope to safely access dependency injection services during application startup.
//using (var scope = app.Services.CreateScope())
//{
//    var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>(); // ✅ Safe
//    var db = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
//    db.Database.Migrate(); // This will apply all pending migrations
//}

// HTTP Pipeline
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Blog API V1");
});

await AdminSeeder.SeedAdminAsync(app.Services, app.Configuration);

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowReactApp");
app.UseExceptionHandler();

app.UseMiddleware<JwtCookieMiddleware>(); // Step 1: Copy jwt from cookie to header
//app.UseMiddleware<JwtMiddleware>();       // Step 2: Validate token, attach user

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => "API is running");
// Test DB connection endpoint
app.MapGet("/testdb", async (BlogDbContext db) =>
{
    try
    {
        // Example: count number of users in database
        var userCount = await db.Users.CountAsync();
        return Results.Ok(new { message = "DB is working", users = userCount });
    }
    catch (Exception ex)
    {
        // Return the exact error if something is wrong
        return Results.Problem(ex.Message);
    }
});


app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();
