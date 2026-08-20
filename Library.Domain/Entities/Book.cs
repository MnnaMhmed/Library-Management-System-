using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Domain.Enums;


namespace Library.Domain.Entities
{
    public class Book
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string ISBN { get; set; } = string.Empty;

        public string? Edition { get; set; }

        public int PublicationYear { get; set; }

        public string? Summary { get; set; }

        public string Language { get; set; } = string.Empty;

        public string? CoverImageUrl { get; set; }

        public BookStatus Status { get; set; }

        public int PublisherId { get; set; }

        public Publisher Publisher { get; set; } = null!;

        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();

        public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();

        public ICollection<BorrowingTransaction> BorrowingTransactions { get; set; } = new List<BorrowingTransaction>();
    }
}