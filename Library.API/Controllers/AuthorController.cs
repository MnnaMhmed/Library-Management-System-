using Library.Application.DTOs;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorsController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        [HttpGet("GetAllAuthors")]
        public async Task<IActionResult> GetAll()
        {
            var authors = await _authorService.GetAllAsync();

            return Ok(authors);
        }

        [HttpGet("GetAuthorById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var author = await _authorService.GetByIdAsync(id);

            if (author == null)
                return NotFound("Author not found.");

            return Ok(author);
        }

        [HttpPost("AddAuthor")]
        [Authorize(Roles = "Administrator,Librarian")]
        public async Task<IActionResult> Create(AuthorDto dto)
        {
            var author = await _authorService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = author.Id },
                author);
        }

        [HttpPut("UpdateAuthor/{id}")]
        [Authorize(Roles = "Administrator,Librarian")]
        public async Task<IActionResult> Update(
            int id,
            AuthorDto dto)
        {
            var updated = await _authorService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Author not found.");

            return Ok("Author updated successfully.");
        }

        [HttpDelete("DeleteAuthor/{id}")]
        [Authorize(Roles = "Administrator,Librarian")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _authorService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Author not found.");

            return Ok("Author deleted successfully.");
        }
    }
}