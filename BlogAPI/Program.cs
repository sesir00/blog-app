using BlogAPI.AppDataContext;
using BlogAPI.Middleware;
using BlogAPI.Models;
using BlogAPI.Services;
using BlogAPI.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddLogging();

builder.Services.AddScoped<IBlogService, BlogService>();

builder.Services.Configure<DbSettings>(builder.Configuration.GetSection("DbSettings"));
builder.Services.AddSingleton<BlogDbContext>();

var app = builder.Build();

//This is used when you want to get your BlogDbContext (your connection to the database) outside of a controller, usually at the start of your app, for example:
//To apply database migrations (create tables)
//To insert some default data (seed the database)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseExceptionHandler(errorApp =>             //In .NET 9 (ASP.NET Core), when you use: app.UseExceptionHandler() You must provide a configuration:
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"An internal server error occurred.\"}");
    });
});
app.UseAuthorization();
app.MapControllers();

app.Run();

