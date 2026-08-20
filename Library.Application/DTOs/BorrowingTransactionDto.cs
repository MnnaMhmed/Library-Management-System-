using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Application.DTOs
{
    public class BorrowingTransactionDto
    {
        public int Id { get; set; }

        public int BookId { get; set; }

        public int MemberId { get; set; }

        public DateTime BorrowedAt { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime? ReturnedAt { get; set; }
    }
}