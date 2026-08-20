using Library.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Library.Application.Interfaces;
using Library.Application.Services;
using Library.Infrastructure.Repositories;
using Microsoft.OpenApi.Models;
using Library.Domain.Entities;
using Library.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Library.API.Extensions;
using Library.API.Middleware;
namespace Library.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddScoped<IPasswordHasher<SystemUser>, PasswordHasher<SystemUser>>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IAuthService,AuthService>();
            builder.Services.AddScoped<IMemberService, MemberService>();
            builder.Services.AddScoped<IBookService, BookService>();
            builder.Services.AddScoped<IPublisherService, PublisherService>();
            builder.Services.AddScoped<IAuthorService, AuthorService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IBorrowingService, BorrowingService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<JwtService>();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
            builder.Services.AddScoped<IActivityLogService, ActivityLogService>();


            builder.Services.AddDbContext<LibraryDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers();

            builder.Services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.TokenValidationParameters =
                        new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                        {
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            IssuerSigningKey =
                                new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                                    System.Text.Encoding.UTF8.GetBytes(
                                        builder.Configuration["Jwt:Key"]!))
                        };
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your Token"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });
            var app = builder.Build();
            app.UseMiddleware<ExceptionMiddleware>();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<LibraryDbContext>();
                var passwordHasher = new PasswordHasher<SystemUser>();

                if (!context.SystemUsers.Any())
                {
                    var admin = new SystemUser
                    {
                        UserName = "admin",
                        Email = "admin@library.com",
                        Role = UserRole.Administrator
                    };

                    admin.PasswordHash = passwordHasher.HashPassword(admin, "Admin@123");

                    context.SystemUsers.Add(admin);
                    context.SaveChanges();
                }
            }
            app.Run();
        }
    }
}