using Library.Application.DTOs;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet ("GetAllBooks")]
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookService.GetAllAsync();

            return Ok(books);
        }

        [HttpGet("GetBookById{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _bookService.GetByIdAsync(id);

            if (book == null)
                return NotFound();

            return Ok(book);
        }

        [HttpPost("AddBook")]
        [Authorize(Roles = "Administrator,Librarian")]
        public async Task<IActionResult> Create(CreateBookDto dto)
        {
            var book = await _bookService.CreateAsync(dto);

            return StatusCode(201, "Book Added successfully");
        }

        [HttpPut("UpdateBook/{id}")]
        [Authorize(Roles = "Administrator,Librarian")]

        public async Task<IActionResult> Update(
            int id,
            CreateBookDto dto)
        {
            var result = await _bookService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("Book not found");

            return Ok("Book updated successfully");
        }

        [HttpDelete("DeleteVBook/{id}")]
        [Authorize(Roles = "Administrator,Librarian")]

        public async Task<IActionResult> Delete(int id)
        {
            var result = await _bookService.DeleteAsync(id);

            if (!result)
                return NotFound("Book not found");

            return Ok("Book deleted successfully");
        }
    }
}