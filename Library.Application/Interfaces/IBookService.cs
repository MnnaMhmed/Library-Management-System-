using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Application.DTOs;
using Library.Domain.Entities;

namespace Library.Application.Interfaces
{
    public interface IBookService
    {
        Task<IEnumerable<BookDto>> GetAllAsync();

        Task<BookDto?> GetByIdAsync(int id);

        Task<BookDto> CreateAsync(CreateBookDto dto);

        Task<bool> UpdateAsync(int id, CreateBookDto dto);

        Task<bool> DeleteAsync(int id);
    }
}