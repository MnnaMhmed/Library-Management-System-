using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublishersController : ControllerBase
    {
        private readonly IPublisherService _publisherService;

        public PublishersController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        [HttpGet("GetAllPublishers")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> GetAll()
        {
            var publishers = await _publisherService.GetAllAsync();

            return Ok(publishers);
        }

        [HttpGet("GetPublisherById/{id}")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> GetById(int id)
        {
            var publisher = await _publisherService.GetByIdAsync(id);

            if (publisher == null)
                return NotFound();

            return Ok(publisher);
        }

        [HttpPost("AddPublisher")]
        [Authorize(Roles = "Administrator,Librarian")]

        public async Task<IActionResult> Create(PublisherDto dto)
        {
            var publisherId = await _publisherService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = publisherId },
                new { id = publisherId });
        }


        [HttpPut("UpdatePublisher{id}")]
        [Authorize(Roles = "Administrator,Librarian")]

        public async Task<IActionResult> Update(
            int id,
            PublisherDto dto)
        {
            var updated = await _publisherService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("DeletePublisher/{id}")]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _publisherService.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}