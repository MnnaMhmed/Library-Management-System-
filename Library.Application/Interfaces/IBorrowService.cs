using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IBorrowingService
    {
        Task<BorrowingTransactionDto> BorrowAsync(BorrowBookDto dto);

        Task<bool> ReturnAsync(int borrowingId);

        Task<IEnumerable<BorrowingTransactionDto>> GetAllAsync();

        Task<BorrowingTransactionDto?> GetByIdAsync(int id);
    }
}