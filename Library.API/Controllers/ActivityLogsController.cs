using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using global::Library.Application.Interfaces;
using Library.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

    namespace Library.API.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        [Authorize(Roles = "Administrator")]
        public class ActivityLogsController : ControllerBase
        {
            private readonly IActivityLogService _activityLogService;

            public ActivityLogsController(
                IActivityLogService activityLogService)
            {
                _activityLogService = activityLogService;
            }

            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var logs = await _activityLogService.GetAllAsync();

                return Ok(logs);
            }
        }
    }

