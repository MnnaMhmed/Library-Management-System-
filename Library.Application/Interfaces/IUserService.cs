using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<SystemUserDto>> GetAllAsync();

        Task<SystemUserDto?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int id, SystemUserDto dto);
        Task<bool> DeleteAsync(int id);
    }
}