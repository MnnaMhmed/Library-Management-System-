using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IPublisherService
    {
        Task<IEnumerable<PublisherDto>> GetAllAsync();

        Task<PublisherDto?> GetByIdAsync(int id);

        Task<PublisherDto> CreateAsync(PublisherDto dto);

        Task<bool> UpdateAsync(int id, PublisherDto dto);

        Task<bool> DeleteAsync(int id);
    }
}