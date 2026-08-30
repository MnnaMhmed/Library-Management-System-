using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDto>> GetAllAsync();

        Task<AuthorDto?> GetByIdAsync(int id);

        Task<AuthorDto> CreateAsync(CreateAuthorDto dto);

        Task<bool> UpdateAsync(int id, CreateAuthorDto dto);

        Task<bool> DeleteAsync(int id);
    }
}