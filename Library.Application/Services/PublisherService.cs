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
    public class PublisherService : IPublisherService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public PublisherService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService = activityLogService;
        }

        public async Task<IEnumerable<PublisherDto>> GetAllAsync()
        {
            var publishers = await _unitOfWork.Publishers.GetAllAsync();

            return publishers.Select(p => new PublisherDto
            {
                Name = p.Name,
                Address = p.Address,
                PhoneNumber = p.PhoneNumber,
                Email = p.Email
            });
        }

        public async Task<PublisherDto?> GetByIdAsync(int id)
        {
            var publisher = await _unitOfWork.Publishers.GetByIdAsync(id);

            if (publisher == null)
                return null;

            return new PublisherDto
            {
                Name = publisher.Name,
                Address = publisher.Address,
                PhoneNumber = publisher.PhoneNumber,
                Email = publisher.Email
            };
        }

        public async Task<PublisherDto> CreateAsync(PublisherDto dto)
        {
            var publisher = new Publisher
            {
                Name = dto.Name,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email
            };

            await _unitOfWork.Publishers.AddAsync(publisher);
            await _activityLogService.LogAsync(
    ActivityAction.Create,
    "Publisher",
    publisher.Id);
            await _unitOfWork.SaveChangesAsync();

            return new PublisherDto
            {
                Name = publisher.Name,
                Address = publisher.Address,
                PhoneNumber = publisher.PhoneNumber,
                Email = publisher.Email
            };
        }

        public async Task<bool> UpdateAsync(
            int id,
            PublisherDto dto)
        {
            var publisher = await _unitOfWork.Publishers.GetByIdAsync(id);

            if (publisher == null)
                return false;

            publisher.Name = dto.Name;
            publisher.Address = dto.Address;
            publisher.PhoneNumber = dto.PhoneNumber;
            publisher.Email = dto.Email;

            _unitOfWork.Publishers.Update(publisher);

            await _activityLogService.LogAsync(
    ActivityAction.Update,
    "Publisher",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var publisher = await _unitOfWork.Publishers.GetByIdAsync(id);

            if (publisher == null)
                return false;

            _unitOfWork.Publishers.Delete(publisher);
            await _activityLogService.LogAsync(
    ActivityAction.Delete,
    "Publisher",
    id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}