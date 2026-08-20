using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Domain.Enums;
using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IActivityLogService
    {
        Task LogAsync(
            ActivityAction action,
            string entityName,
            int? entityId = null);

        Task<IEnumerable<ActivityLogDto>> GetAllAsync();
    }
}