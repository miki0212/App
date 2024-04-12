using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly ILogger<UserDataController> _logger;
        private readonly IConfiguration _configuration;
        private UserDataService _userService;

        public UserDataController(ILogger<UserDataController> logger, IConfiguration configuration)
        {
            _userService = new UserDataService(configuration);
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("setProfileData", Name = "SetProfileData")]
        public async Task<IActionResult> SetUserProfile([FromBody] UserDataDto UserData)
        {
            Dictionary<string, string> statusMap = await _userService.SetUserData(UserData);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0)
            {
                return Ok(message);
            }
            else if (int.Parse(code) == 1)
            {
                return NotFound(message);
            }
            else
            {
                return Conflict(message);
            }
        }
      
        //public async Task<IActionResult> GetUserPrifile() { 

        //}
    }
}
