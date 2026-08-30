using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
namespace Library.Application.DTOs
{
    public class AuthorDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Desciption { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Nationality { get; set; }

    }

    public class CreateAuthorDto
    {
    

        public string Name { get; set; } = string.Empty;
        public string Desciption { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Nationality { get; set; }

    }
}