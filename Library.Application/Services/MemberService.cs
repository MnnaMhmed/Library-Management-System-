using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Library.Domain.Entities;
using Library.Domain.Enums;

namespace Library.Application.Services
{
    public class MemberService : IMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public MemberService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService = activityLogService;
        }
        public async Task<IEnumerable<MemberDto>> GetAllAsync()
        {
            var members = await _unitOfWork.Members.GetAllAsync();

            return members.Select(m => new MemberDto
            {
                Id= m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                PhoneNumber = m.PhoneNumber,
            });
        }

        public async Task<MemberDto?> GetByIdAsync(int id)
        {
            var member = await _unitOfWork.Members.GetByIdAsync(id);

            if (member == null)
                return null;

            return new MemberDto
            {
                Id=member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                PhoneNumber = member.PhoneNumber,
            };
        }

        public async Task<CreateMemberDto> CreateAsync(CreateMemberDto dto)
        {
            var member = new Member
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                RegistrationDate = DateTime.UtcNow
            };

            await _unitOfWork.Members.AddAsync(member);

            await _activityLogService.LogAsync(
    ActivityAction.Create,
    "Member",
    member.Id);
            await _unitOfWork.SaveChangesAsync();

            return new CreateMemberDto
            {
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                PhoneNumber = member.PhoneNumber,
            };
        }

        public async Task<bool> UpdateAsync(int id, CreateMemberDto dto)
        {
            var member = await _unitOfWork.Members.GetByIdAsync(id);

            if (member == null)
                return false;

            member.FirstName = dto.FirstName;
            member.LastName = dto.LastName;
            member.Email = dto.Email;
            member.PhoneNumber = dto.PhoneNumber;

            _unitOfWork.Members.Update(member);
            await _activityLogService.LogAsync(
            ActivityAction.Update,
            "Member",
            id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var member = await _unitOfWork.Members.GetByIdAsync(id);

            if (member == null)
                return false;

            _unitOfWork.Members.Delete(member);
            await _activityLogService.LogAsync(
                ActivityAction.Delete,
                "Member",
                id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}