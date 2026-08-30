using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IMemberService
    {
        Task<IEnumerable<MemberDto>> GetAllAsync();

        Task<MemberDto?> GetByIdAsync(int id);

        Task<CreateMemberDto> CreateAsync(CreateMemberDto dto);

        Task<bool> UpdateAsync(int id, CreateMemberDto dto);

        Task<bool> DeleteAsync(int id);
    }
}