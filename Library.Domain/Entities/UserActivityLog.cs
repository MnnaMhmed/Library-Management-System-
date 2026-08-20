using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Library.Domain.Enums;

namespace Library.Domain.Entities
{
    public class UserActivityLog
    {
        public int Id { get; set; }

        public int SystemUserId { get; set; }

        public SystemUser SystemUser { get; set; } = null!;

        public ActivityAction Action { get; set; }

        public string EntityName { get; set; } = string.Empty;

        public int? EntityId { get; set; }

        public DateTime Timestamp { get; set; }
    }
}