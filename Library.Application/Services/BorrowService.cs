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
    public class BorrowingService : IBorrowingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IActivityLogService _activityLogService;
        public BorrowingService(IUnitOfWork unitOfWork, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _activityLogService = activityLogService;
        }
        public async Task<BorrowingTransactionDto> BorrowAsync(
            BorrowBookDto dto)
        {
            var book = await _unitOfWork.Books.GetByIdAsync(dto.BookId);

            if (book == null)
                throw new Exception("Book not found.");

            if (book.Status == BookStatus.Out)
                throw new Exception("Book is already borrowed.");

            var member = await _unitOfWork.Members.GetByIdAsync(dto.MemberId);

            if (member == null)
                throw new Exception("Member not found.");

            var transaction = new BorrowingTransaction
            {
                BookId = dto.BookId,
                MemberId = dto.MemberId,
                BorrowedAt = DateTime.UtcNow,
                DueDate = dto.DueDate
            };

            book.Status = BookStatus.Out;

            _unitOfWork.Books.Update(book);

            await _unitOfWork.BorrowingTransactions
                .AddAsync(transaction);

            await _activityLogService.LogAsync(
        ActivityAction.Borrow,
        "BorrowingTransaction",
        transaction.Id);
            await _unitOfWork.SaveChangesAsync();

            return new BorrowingTransactionDto
            {
                Id = transaction.Id,
                BookId = transaction.BookId,
                MemberId = transaction.MemberId,
                BorrowedAt = transaction.BorrowedAt,
                DueDate = transaction.DueDate,
                ReturnedAt = transaction.ReturnedAt
            };
        }

        public async Task<bool> ReturnAsync(int borrowingId)
        {
            var transaction =
                await _unitOfWork.BorrowingTransactions
                    .GetByIdAsync(borrowingId);

            if (transaction == null)
                return false;

            if (transaction.ReturnedAt.HasValue)
                return false;

            var book =
                await _unitOfWork.Books
                    .GetByIdAsync(transaction.BookId);

            if (book == null)
                return false;

            transaction.ReturnedAt = DateTime.UtcNow;

            book.Status = BookStatus.In;

            _unitOfWork.Books.Update(book);

            _unitOfWork.BorrowingTransactions.Update(transaction);
            await _activityLogService.LogAsync(
    ActivityAction.Return,
    "BorrowingTransaction",
    transaction.Id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<BorrowingTransactionDto>>
            GetAllAsync()
        {
            var transactions =
                await _unitOfWork.BorrowingTransactions.GetAllAsync();

            return transactions.Select(x => new BorrowingTransactionDto
            {
                Id = x.Id,
                BookId = x.BookId,
                MemberId = x.MemberId,
                BorrowedAt = x.BorrowedAt,
                DueDate = x.DueDate,
                ReturnedAt = x.ReturnedAt
            });
        }

        public async Task<BorrowingTransactionDto?> GetByIdAsync(int id)
        {
            var transaction =
                await _unitOfWork.BorrowingTransactions.GetByIdAsync(id);

            if (transaction == null)
                return null;

            return new BorrowingTransactionDto
            {
                Id = transaction.Id,
                BookId = transaction.BookId,
                MemberId = transaction.MemberId,
                BorrowedAt = transaction.BorrowedAt,
                DueDate = transaction.DueDate,
                ReturnedAt = transaction.ReturnedAt
            };
        }
    }
}