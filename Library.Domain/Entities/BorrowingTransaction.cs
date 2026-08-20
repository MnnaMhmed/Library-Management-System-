using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Domain.Entities
{
    public class BorrowingTransaction
    {
        public int Id { get; set; }

        public int BookId { get; set; }

        public Book Book { get; set; } = null!;

        public int MemberId { get; set; }

        public Member Member { get; set; } = null!;

        public DateTime BorrowedAt { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? ReturnedAt { get; set; }
    }
}