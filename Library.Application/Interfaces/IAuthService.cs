using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Application.DTOs;

namespace Library.Application.Interfaces
{
    public interface IAuthService
    {
        Task<SystemUserDto> RegisterAsync(RegisterUserDto dto);

        Task<string?> LoginAsync(LoginDto dto);
    }
}