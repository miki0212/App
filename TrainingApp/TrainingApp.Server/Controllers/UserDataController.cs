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

        [HttpGet("getProfilData", Name = "getProfilData")]
        public async Task<IActionResult> GetUserData(int UserId)
        {
            Dictionary<string, UserDataDto> statusMap = await _userService.GetUserData(UserId);
            statusMap.TryGetValue("UserData", out UserDataDto userData);

            return Ok(userData);
        }

        [HttpGet("getExercises", Name = "getExercises")]
        public async Task<IActionResult> GetExercises(int PageNumber) { 
            Dictionary<string,List<Exercises>> messageExercises = await _userService.GetExercisesPage(PageNumber);

            messageExercises.TryGetValue("message", out List<Exercises> exercise);

            return Ok(exercise);   
        }

        [HttpGet("getExerciseByName", Name = "getExerciseByName")]
        public async Task<IActionResult> GetExerciseByName(string searchString)
        {
            Dictionary<string, List<Exercises>> messageExercises = await _userService.GetExerciseByName(searchString);

            messageExercises.TryGetValue("message", out List<Exercises> exercise);

            return Ok(exercise);
        }


        [HttpGet("getExercisesMaxPage", Name = "getExercisesMaxPage")]
        public async Task<IActionResult> GetExercisesMaxPage()
        {
            int maxPage = await _userService.GetMaxExercisesPage(6);

            return Ok(maxPage);
        }


        //TODO : Move to other file
        [HttpPost("addRemoveFavouriteExercise", Name = "addRemoveFavouriteExercise")]
        public async Task<IActionResult> AddRemoveFavouriteExercise([FromBody]DtoExercisesFavourites exercisesFavourites)
        {
            Dictionary<string, bool> messageExercises = await _userService.AddRemoveFavouriteExercise(exercisesFavourites);

            messageExercises.TryGetValue("message", out bool exercise);

            //if (exercise) 
            //{
                return Ok(exercise);
            //}
           
        }

        [HttpPost("checkFavouriteExercises", Name = "checkFavouriteExercises")]
        public async Task<IActionResult> CheckFavouriteExercises([FromBody] DtoExercisesFavourites exercisesFavourites)
        {
            Dictionary<string, bool> messageExercises = await _userService.CheckFavouriteExercises(exercisesFavourites);

            messageExercises.TryGetValue("message", out bool exercise);

            if (exercise)
            {
                return Ok(exercise);
            }
            else
            {
                return Ok(exercise);
            }
        }

        //[HttpGet("getUserExercisesPlan", Name = "getUserExercisesPlan")]
        //public async Task<IActionResult> GetUserExercisesPlan(int UserId,string date = "")
        //{
        //    Dictionary<string, bool> messageExercises = await _userService.GetUserExercisesPlan(UserId,date);

        //    messageExercises.TryGetValue("message", out bool exercise);

        //    if (exercise)
        //    {
        //        return Ok(exercise);
        //    }
        //    else
        //    {
        //        return Ok(exercise);
        //    }
        //}

        [HttpPost("addUserExercisesPlan", Name = "addUserExercisesPlan")]
        public async Task<IActionResult> AddUserExercisesPlan([FromBody] DtoExercisesAddPlan newExercises)
        {
            Dictionary<string, bool> messageExercises = await _userService.AddUserExercisesPlan(newExercises);

            messageExercises.TryGetValue("message", out bool exercise);

            if (exercise)
            {
                return Ok(exercise);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpGet("getUserExercisesPlan", Name = "getUserExercisesPlan")]
        public async Task<IActionResult> GetUserExercisesPlan(int UserId)
        {
            var exerciseList = await _userService.GetUserExercisesPlan(UserId);
            exerciseList.TryGetValue("message", out List<ExerciseOne> list);
            return Ok(list);
        }

        [HttpGet("calculateExerciseCalories", Name = "calculateExerciseCalories")]
        public async Task<IActionResult> CalculateExerciseCalories(int UserId)
        {
            var exerciseList = await _userService.CalculateExerciseCalories(UserId);
            exerciseList.TryGetValue("message", out double caloricExerciseSum);
           
            return Ok(caloricExerciseSum);
        }

        [HttpGet("getExercisesUserRanking", Name = "getExercisesUserRanking")]
        public async Task<IActionResult> GetExercisesUserRanking(int UserId)
        {
            var exerciseList = await _userService.GetExercisesUserRanking(UserId,4);
            exerciseList.TryGetValue("message", out DtoUserRankingList caloricExerciseSum);

            return Ok(caloricExerciseSum);
        }
    }
}
