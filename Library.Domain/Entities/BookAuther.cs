using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Library.Domain.Entities
{
    public class BookAuthor
    {
        public int BookId { get; set; }

        public Book Book { get; set; } = null!;

        public int AuthorId { get; set; }

        public Author Author { get; set; } = null!;
    }
}