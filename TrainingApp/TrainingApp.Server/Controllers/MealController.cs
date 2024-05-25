using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MealController: ControllerBase
    {
        private readonly ILogger<MealController> _logger;
        private readonly IConfiguration _configuration;
        private MealService _mealService;
        private readonly int _mealsByPage = 1;

        public MealController(ILogger<MealController> logger, IConfiguration configuration)
        {
            _mealService = new MealService(configuration);
            _logger = logger;
            _configuration = configuration;
            _mealsByPage = 6;
        }


        [HttpGet("getMealMaxSize", Name = "getMealMaxSize")]
        public async Task<IActionResult> GetMealMaxSize()
        {
            Dictionary<string, string> statusMap = await _mealService.GetMealMaxPage(_mealsByPage);

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

        [HttpGet("getMealPage", Name = "getMealPage")]
        public async Task<IActionResult> GetMealPage(int page)
            {
            Dictionary<string, List<Meals>> statusMap = await _mealService.GetMealPage(page);

        
            statusMap.TryGetValue("message", out List<Meals> mealList);

            if (mealList.Count != 0)
            {
                return Ok(mealList);
            }
            else
            {
                return NotFound("ERROR");
            }
        }

        [HttpGet("getUserMealHistory", Name = "getUserMealHistory")]
        public async Task<IActionResult> GetUserMealHistory(int page)
        {
            Dictionary<string, List<UserMealHistoryDto>> statusMap = await _mealService.GetUserMealHistory();


            statusMap.TryGetValue("message", out List<UserMealHistoryDto> mealHistory);

            if (mealHistory.Count != 0)
            {
                return Ok(mealHistory);
            }
            else
            {
                return NotFound("ERROR");
            }
        }


        [HttpGet("getMealByName", Name = "getMealByName")]
        public async Task<IActionResult> GetMealByName(string searchString)
        {
            Dictionary<string, List<Meals>> message = await _mealService.GetMealByName(searchString);

            message.TryGetValue("message", out List<Meals> meal);

            return Ok(meal);
        }


        [HttpPost("addUserMealHistory", Name = "addUserMealHistory")]
        public async Task<IActionResult> AddUserMealHistory([FromBody] UserMealHistory newMeal)
        {
            Dictionary<string, bool> message = await _mealService.AddUserMealHistory(newMeal);

            message.TryGetValue("message", out bool meal);

            if (meal)
            {
                return Ok(meal);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpGet("calculateCalories", Name = "calculateCalories")]
        public async Task<IActionResult> CalculateCalories(int UserId)
        {
            Dictionary<string, double> statusMap = await _mealService.CalculateCalories(UserId);


            statusMap.TryGetValue("message", out double currentCalories);

            return Ok(currentCalories);
        }
    }

}
