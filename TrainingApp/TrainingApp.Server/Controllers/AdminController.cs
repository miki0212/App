using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ILogger<AdminController> _logger;
        private readonly IConfiguration _configuration;
        private AdminService _adminService;

        public AdminController(ILogger<AdminController> logger, IConfiguration configuration)
        {
            _adminService = new AdminService(configuration);
            _logger = logger;
            _configuration = configuration;
        }

        //[HttpPost(Name = "registerUser")]
        [HttpPost("registerAdmin", Name = "registerAdmin")]
        public async Task<IActionResult> RegisterUser([FromBody] DtoAdminData Admin)
        {
            Dictionary<string, string> statusMap = await _adminService.RegisterAdmin(Admin);

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

        [HttpPost("loginAdmin", Name = "loginAdmin")]
        public async Task<IActionResult> LoginAdmin([FromBody] DtoAdminCredentials Admin)
        {
            Dictionary<string, string> statusMap = await _adminService.LoginAdmin(Admin);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0 || int.Parse(code) == 2)
            {
                return Ok(statusMap);
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


        [HttpGet("getAdminPrivileges", Name = "getAdminPrivileges")]
        public async Task<IActionResult> GetAdminPrivileges(int adminId)
        {
            Dictionary<string, string> statusMap = await _adminService.GetAdminPrivileges(adminId);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0 || int.Parse(code) == 2)
            {
                return Ok(statusMap);
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

        [HttpPost("addAdminExercise", Name = "addAdminExercise")]
        public async Task<IActionResult> AddAdminExercise([FromBody] DtoNewExercise newExercise)
        {
            Dictionary<string, string> statusMap = await _adminService.AddAdminExercise(newExercise);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0 || int.Parse(code) == 2)
            {
                return Ok(statusMap);
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


        [HttpGet("getAdminUserList", Name = "getAdminUserList")]
        public async Task<IActionResult> GetAdminUserList(int adminId,int pageNumber)
        {
            Dictionary<string, string> statusMap = await _adminService.GetAdminUserList(adminId, pageNumber);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0 || int.Parse(code) == 2)
            {
                return Ok(statusMap);
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
