using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Library.Domain.Entities;

using System.Threading.Tasks;
using Library.Domain.Entities;
using Library.Infrastructure.Data;
using Library.Application.Interfaces;
namespace Library.Infrastructure.Repositories
{
    public class UnitOfWork :IUnitOfWork
    {
        private readonly LibraryDbContext _context;

        public IGenericRepository<Book> Books { get; }

        public IGenericRepository<Author> Authors { get; }

        public IGenericRepository<Category> Categories { get; }

        public IGenericRepository<Publisher> Publishers { get; }

        public IGenericRepository<Member> Members { get; }

        public IGenericRepository<BorrowingTransaction> BorrowingTransactions { get; }

        public IGenericRepository<SystemUser> SystemUsers { get; }

        public IGenericRepository<UserActivityLog> UserActivityLogs { get; }
        public IGenericRepository<BookAuthor> BookAuthors { get; }

       public IGenericRepository<BookCategory> BookCategories { get; }
        public UnitOfWork(LibraryDbContext context)
        {
            _context = context;

            Books = new GenericRepository<Book>(_context);
            Authors = new GenericRepository<Author>(_context);
            Categories = new GenericRepository<Category>(_context);
            Publishers = new GenericRepository<Publisher>(_context);
            Members = new GenericRepository<Member>(_context);
            BorrowingTransactions =
                new GenericRepository<BorrowingTransaction>(_context);
            SystemUsers = new GenericRepository<SystemUser>(_context);
            UserActivityLogs = new GenericRepository<UserActivityLog>(_context);
            BookAuthors = new GenericRepository<BookAuthor>(_context);

            BookCategories = new GenericRepository<BookCategory>(_context);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
