using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Application.DTOs
{
    public class BorrowBookDto
    {
        public int BookId { get; set; }

        public int MemberId { get; set; }

        public DateTime DueDate { get; set; }
    }
}