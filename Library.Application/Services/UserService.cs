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
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PasswordHasher<SystemUser> _passwordHasher;
        private readonly JwtService _jwtService;
        private readonly IActivityLogService _activityLogService;
       
        public UserService(IUnitOfWork unitOfWork, JwtService jwtService, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _activityLogService = activityLogService;
            _passwordHasher = new PasswordHasher<SystemUser>();
        }

        public async Task<IEnumerable<SystemUserDto>> GetAllAsync()
        {
            var users = await _unitOfWork.SystemUsers.GetAllAsync();

            return users.Select(user => new SystemUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            });
        }

        public async Task<SystemUserDto?> GetByIdAsync(int id)
        {
            var user = await _unitOfWork.SystemUsers.GetByIdAsync(id);

            if (user == null)
                return null;

            return new SystemUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
        }

      
        public async Task<bool> UpdateAsync(int id, SystemUserDto dto)
        {
            var user = await _unitOfWork.SystemUsers.GetByIdAsync(id);

            if (user == null)
                return false;

            user.UserName = dto.UserName;
            user.Email = dto.Email;
            user.Role = dto.Role;

            _unitOfWork.SystemUsers.Update(user);
            await _activityLogService.LogAsync(
          ActivityAction.Update,
 "User",
           id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _unitOfWork.SystemUsers.GetByIdAsync(id);

            if (user == null)
                return false;

            _unitOfWork.SystemUsers.Delete(user);
            await _activityLogService.LogAsync(
            ActivityAction.Delete,
    "User",
              id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}