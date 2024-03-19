using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase, IUserController
    {
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;
        private UserService _userService;

        public UserController(ILogger<UserController> logger, IConfiguration configuration)
        {
            _userService = new UserService(configuration);
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "registerUser")]
        public async Task<IActionResult> RegisterUser([FromBody] UserCredentials User)
        {
            Dictionary<string, string> statusMap = await _userService.RegisterUser(User);
            
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
    }
}
