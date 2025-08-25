using BlogAPI.AppDataContext;
using BlogAPI.Interfaces;
using BlogAPI.Middleware;
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
}); 
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// 2. Configure DbContext
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetSection("DbSettings")["ConnectionString"]));  
// builder.Services.AddDbContext<BlogDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));    

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
             "http://localhost:5000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// This code creates a service scope to safely access dependency injection services during application startup.
using (var scope = app.Services.CreateScope())
{
    var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>(); // ✅ Safe
    var dbContext = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    Console.WriteLine($"Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");
    Console.WriteLine($"Connection string from config: {configuration.GetConnectionString("Default")}");
    Console.WriteLine($"DbContext connection string: {dbContext.Database.GetConnectionString()}");

    // Then your migration code...
    //dbContext.Database.Migrate();


    //  try
    // {
    //     var canConnect = dbContext.Database.CanConnect();
    //     if (canConnect)
    //     {
    //         Console.WriteLine("✅ Successfully connected to the database.");
    //     }
    //     else
    //     {
    //         Console.WriteLine("❌ Failed to connect to the database.");
    //     }
    // }
    // catch (Exception ex)
    // {
    //     Console.WriteLine($"❌ Exception during DB connection check: {ex.Message}");
    // }
    

       const int maxRetries = 5;
    const int delaySeconds = 5;
    int attempt = 0;
    bool connected = false;

    while (attempt < maxRetries && !connected)
    {
        try
        {
            attempt++;
            Console.WriteLine($"🔄 Attempt {attempt} to connect to the database...");

            connected = dbContext.Database.CanConnect();

            if (connected)
            {
                Console.WriteLine("✅ Successfully connected to the database.");
            }
            else
            {
                Console.WriteLine("❌ Failed to connect to the database.");
                if (attempt < maxRetries)
                    Thread.Sleep(TimeSpan.FromSeconds(delaySeconds));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Exception during DB connection check: {ex.Message}");
            if (attempt < maxRetries)
                Thread.Sleep(TimeSpan.FromSeconds(delaySeconds));
        }
    }


}

// HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowReactApp");
app.UseExceptionHandler();

app.UseMiddleware<JwtCookieMiddleware>(); // Step 1: Copy jwt from cookie to header
//app.UseMiddleware<JwtMiddleware>();       // Step 2: Validate token, attach user

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// send everything else to index.html so React Router works
app.MapFallbackToFile("index.html");
app.Run();
