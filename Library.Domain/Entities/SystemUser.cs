using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Domain.Enums;

namespace Library.Domain.Entities
{
    public class SystemUser
    {
        public int Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public ICollection<UserActivityLog> ActivityLogs { get; set; }
            = new List<UserActivityLog>();
    }
}