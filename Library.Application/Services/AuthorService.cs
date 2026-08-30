using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Library.Domain.Entities;
using Library.Domain.Enums;

namespace Library.Application.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public AuthorService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService = activityLogService;
        }
        public async Task<IEnumerable<AuthorDto>> GetAllAsync()
        {
            var authors = await _unitOfWork.Authors.GetAllAsync();

            return authors.Select(a => new AuthorDto
            {
                Id = a.Id,
                Name = a.Name,
                Desciption= a.Desciption,
                BirthDate=a.BirthDate,
                Nationality=a.Nationality
            });
        }

        public async Task<AuthorDto?> GetByIdAsync(int id)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id);

            if (author == null)
                return null;

            return new AuthorDto
            {
                Id = author.Id,
                Name = author.Name,
                Desciption = author.Desciption,
                BirthDate = author.BirthDate,
                Nationality = author.Nationality
            };
        }

        public async Task<AuthorDto> CreateAsync(CreateAuthorDto dto)
        {
            var author = new Author
            {
                Name = dto.Name,
                Desciption = dto.Desciption,
                BirthDate = dto.BirthDate,
                Nationality = dto.Nationality
            };

            await _unitOfWork.Authors.AddAsync(author);
            await _activityLogService.LogAsync(
    ActivityAction.Create,
    "Author",
    author.Id);
            await _unitOfWork.SaveChangesAsync();

            return new AuthorDto
            {
                Id = author.Id,
                Name = author.Name,
                Desciption = author.Desciption,
                BirthDate = author.BirthDate,
                Nationality = author.Nationality
            };
        }

        public async Task<bool> UpdateAsync(
            int id,
            CreateAuthorDto dto)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id);

            if (author == null)
                return false;

            author.Name = dto.Name;
            author.Desciption = dto.Desciption;
            author.BirthDate = dto.BirthDate;
            author.Nationality = dto.Nationality;





            author.Name = dto.Name;

            _unitOfWork.Authors.Update(author);
            await _activityLogService.LogAsync(
    ActivityAction.Update,
    "Author",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var author = await _unitOfWork.Authors.GetByIdAsync(id);

            if (author == null)
                return false;

            _unitOfWork.Authors.Delete(author);
            await _activityLogService.LogAsync(
    ActivityAction.Delete,
    "Author",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}