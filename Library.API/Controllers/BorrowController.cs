using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowingController : ControllerBase
    {
        private readonly IBorrowingService _borrowingService;

        public BorrowingController(IBorrowingService borrowingService)
        {
            _borrowingService = borrowingService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await _borrowingService.GetAllAsync();

            return Ok(transactions);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transaction = await _borrowingService.GetByIdAsync(id);

            if (transaction == null)
                return NotFound();

            return Ok(transaction);
        }

        [HttpPost("borrow")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> Borrow(BorrowBookDto dto)
        {
            try
            {
                var transaction =
                    await _borrowingService.BorrowAsync(dto);

                return Ok(transaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("return/{id}")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> Return(int id)
        {
            var result = await _borrowingService.ReturnAsync(id);

            if (!result)
                return BadRequest("Transaction not found ");

            return Ok("Book returned successfully");
        }
    }
}