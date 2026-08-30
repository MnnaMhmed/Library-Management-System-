using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Library.Domain.Enums;

namespace Library.Application.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ISBN { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Edition { get; set; }

        [Range(1000, 2100)]
        public int PublicationYear { get; set; }

        public string? Summary { get; set; }

        [Required]
        public BookStatus Status { get; set; }
        [Required]
        public string Language { get; set; } = string.Empty;

        public string? CoverImageUrl { get; set; }

        [Required]
        public int PublisherId { get; set; }

        public List<int> AuthorIds { get; set; } = new();

        public List<int> CategoryIds { get; set; } = new();
    }
    public class CreateBookDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ISBN { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Edition { get; set; }

        [Range(1000, 2100)]
        public int PublicationYear { get; set; }

        public string? Summary { get; set; }

        [Required]
        public BookStatus Status { get; set; }
        [Required]
        public string Language { get; set; } = string.Empty;

        public string? CoverImageUrl { get; set; }

        [Required]
        public int PublisherId { get; set; }

        public List<int> AuthorIds { get; set; } = new();

        public List<int> CategoryIds { get; set; } = new();
    }
}