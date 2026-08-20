using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Domain.Entities;
using Library.Domain.Entities;
namespace Library.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Book> Books { get; }
        IGenericRepository<Author> Authors { get; }
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Publisher> Publishers { get; }
        IGenericRepository<Member> Members { get; }
        IGenericRepository<BorrowingTransaction> BorrowingTransactions { get; }
        IGenericRepository<SystemUser> SystemUsers { get; }
        IGenericRepository<UserActivityLog> UserActivityLogs { get; }
        IGenericRepository<BookAuthor> BookAuthors { get; }

        IGenericRepository<BookCategory> BookCategories { get; }
        Task<int> SaveChangesAsync();
    }
}