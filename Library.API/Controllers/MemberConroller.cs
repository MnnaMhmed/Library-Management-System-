using Library.Application.DTOs;
using Library.Application.Interfaces;
using Library.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MembersController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpGet ("GetAllMembers")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]
        public async Task<IActionResult> GetAll()
        {
            var members = await _memberService.GetAllAsync();

            return Ok(members);
        }

        [HttpGet("GetMemberById/{id}")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> GetById(int id)
        {
            var member = await _memberService.GetByIdAsync(id);

            if (member == null)
                return NotFound();

            return Ok(member);
        }

        [HttpPost("Add_Member")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]
        public async Task<IActionResult> Create(CreateMemberDto dto)
        {
            var memberId = await _memberService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = memberId },
                new { id = memberId });
        }
        [HttpPut("UpdateMember/{id}")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]

        public async Task<IActionResult> Update(
            int id,
            CreateMemberDto dto)
        {
            var updated = await _memberService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Member Not Found");

            return Ok("member Updated Successfully");
        }

        [HttpDelete("DeleteMember/{id}")]
        [Authorize(Roles = "Administrator,Librarian,Staff")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _memberService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Member Not Found");

            return Ok("member deleted Successfully");
        }
    }
}