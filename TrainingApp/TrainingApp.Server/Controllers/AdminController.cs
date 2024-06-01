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
        public async Task<IActionResult> GetAdminUserList(int pageNumber)
        {
            Dictionary<string, string> statusMap = await _adminService.GetAdminUserList(pageNumber);

            statusMap.TryGetValue("statusCode", out string code);
            statusMap.TryGetValue("message", out string message);

            if (int.Parse(code) == 0 || int.Parse(code) == 2)
            {
                return Ok(message);
            }
            else if (int.Parse(code) == 1)
            {
                return Ok(message);
            }
            else
            {
                return Conflict(message);
            }
        }

        [HttpGet("getMaxUserPage", Name = "getMaxUserPage")]
        public async Task<IActionResult> GetMaxUserPage()
        {
            int statusMap = await _adminService.GetMaxUserPage();

            //statusMap.TryGetValue("statusCode", out string code);
            //statusMap.TryGetValue("message", out string message);
            return Ok(statusMap);
            //if (int.Parse(code) == 0 || int.Parse(code) == 2)
            //{
            //    return Ok(statusMap);
            //}
            //else if (int.Parse(code) == 1)
            //{
            //    return NotFound(message);
            //}
            //else
            //{
            //    return Conflict(message);
            //}
        }

        [HttpGet("blockUser", Name = "blockUser")]
        public async Task<IActionResult> BlockUser(int userId)
        {
            string status = await _adminService.BlockUser(userId);



            if (status.Equals("Blad serwera !!! Sprobuj pozniej !!!"))
            {
                return Ok(status);
            }
            else
            {
                return Ok(status);
            }

        }
    }
}
