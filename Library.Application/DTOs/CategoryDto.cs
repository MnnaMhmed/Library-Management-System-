using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Library.Application.DTOs
{
    public class CategoryDto
    {

        public string Name { get; set; } = string.Empty;

        public int? ParentCategoryId { get; set; }
    }
}