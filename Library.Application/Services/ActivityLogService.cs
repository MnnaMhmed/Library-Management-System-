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
    public class ActivityLogService : IActivityLogService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUser;

        public ActivityLogService(
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUser)
        {
            _unitOfWork = unitOfWork;
            _currentUser = currentUser;
        }

        public async Task LogAsync(
            ActivityAction action,
            string entityName,
            int? entityId = null)
        {
            if (_currentUser.UserId == null)
                return;

            var log = new UserActivityLog
            {
                SystemUserId = _currentUser.UserId.Value,
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Timestamp = DateTime.UtcNow
            };

            await _unitOfWork.UserActivityLogs.AddAsync(log);
        }

        public async Task<IEnumerable<ActivityLogDto>> GetAllAsync()
        {
            var logs = await _unitOfWork.UserActivityLogs.GetAllAsync();

            return logs.Select(log => new ActivityLogDto
            {
                Id = log.Id,
                SystemUserId = log.SystemUserId,
                Action = log.Action.ToString(),
                EntityName = log.EntityName,
                EntityId = log.EntityId,
                Timestamp = log.Timestamp
            });
        }
    }
}