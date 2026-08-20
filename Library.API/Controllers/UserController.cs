using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Library.Application.DTOs;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
namespace Library.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAllUsers")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();

            return Ok(users);
        }

        [HttpGet("GetUserById{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user );
        }



        [HttpPut("UpdateUser/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(int id, SystemUserDto dto)
        {
            var result = await _userService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("User not found");

            return Ok("User updated successfully");
        }
        [HttpDelete("DeleteUser{id}")]
        [Authorize(Roles = "Administrator")]

        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteAsync(id);

            if (!result)
                return NotFound("User not found");

            return Ok ("User Deleted Successfully");     }
    }
}