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
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public CategoryService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService = activityLogService;
        }
        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();

            return categories.Select(c => new CategoryDto
            {
                id=c.Id,
                Name = c.Name,
                ParentCategoryId = c.ParentCategoryId
            });
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if (category == null)
                return null;

            return new CategoryDto
            {
                id = category.Id,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId
            };
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            if (dto.ParentCategoryId.HasValue)
            {
                var parent = await _unitOfWork.Categories
                    .GetByIdAsync(dto.ParentCategoryId.Value);

                if (parent == null)
                    throw new Exception("Parent category not found.");
            }

            var category = new Category
            {
                Name = dto.Name,
                ParentCategoryId = dto.ParentCategoryId
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _activityLogService.LogAsync(
    ActivityAction.Create,
    "Category",
    category.Id);
            await _unitOfWork.SaveChangesAsync();

            return new CategoryDto
            {
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId
            };
        }

        public async Task<bool> UpdateAsync(int id, CreateCategoryDto dto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if (category == null)
                return false;

            if (dto.ParentCategoryId == id)
                throw new Exception("Category cannot be its own parent.");

            if (dto.ParentCategoryId.HasValue)
            {
                var parent = await _unitOfWork.Categories
                    .GetByIdAsync(dto.ParentCategoryId.Value);

                if (parent == null)
                    return false;
            }




            category.Name = dto.Name;
            category.ParentCategoryId = dto.ParentCategoryId;

            _unitOfWork.Categories.Update(category);
            await _activityLogService.LogAsync(
    ActivityAction.Update,
    "Category",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if (category == null)
                return false;

            _unitOfWork.Categories.Delete(category);
            await _activityLogService.LogAsync(
    ActivityAction.Delete,
    "Category",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}