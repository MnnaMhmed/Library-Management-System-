using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Library.Domain.Entities;
using Library.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Library.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher<SystemUser> _passwordHasher;
        private readonly IActivityLogService _activityLogService;
        private readonly JwtService _jwtService;

        public AuthService(
            IUnitOfWork unitOfWork,
            IPasswordHasher<SystemUser> passwordHasher,
            IActivityLogService activityLogService,
           JwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
            _activityLogService = activityLogService;
            _jwtService = jwtService;
        }

        public async Task<SystemUserDto> RegisterAsync(RegisterUserDto dto)
        {
            var existingUser = await _unitOfWork.SystemUsers
                .FindAsync(x => x.UserName == dto.UserName);

            if (existingUser.Any())
                throw new Exception("Username already exists.");

            var user = new SystemUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Role = dto.Role
            };

            user.PasswordHash =
                _passwordHasher.HashPassword(user, dto.Password);

            await _unitOfWork.SystemUsers.AddAsync(user);

            await _activityLogService.LogAsync(
                ActivityAction.Create,
                "User",
                user.Id);

            await _unitOfWork.SaveChangesAsync();

            return new SystemUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            var users = await _unitOfWork.SystemUsers
                .FindAsync(x => x.UserName == dto.UserName);

            var user = users.FirstOrDefault();

            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password);

            if (result == PasswordVerificationResult.Failed)
                return null;

            await _activityLogService.LogAsync(
                ActivityAction.Login,
                "SystemUser",
                user.Id);

            return _jwtService.GenerateToken(user);
        }
    }
}