using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase,IUserController
    {
        //private readonly AppDbContext _dbContext;
        public UserController(ILogger<WeatherForecastController> logger)
        {
            //_dbContext = dbContext;
        }

        [HttpPost(Name = "registerUser")]
        public async Task<bool> RegisterUser(string login,string imie,string nazwisko,string email,string password)
        {
            //Check 



            using (FitAppContext context = new FitAppContext()) 
            {
                var existsLogin = context.Users.FirstOrDefault(t => t.Login == login);
                var existsEmail = context.Users.FirstOrDefault(t => t.Email == email);


                if (existsLogin != null || existsEmail != null) 
                {
                    return false;
                }

                var newUser = new User
                {
                    Login = login,
                    Imie = imie,
                    Nazwisko = nazwisko,
                    Email = email,
                    Haslo = password
                };

                context.Users.Add(newUser);
                context.SaveChanges();
            }
       
            return true;
        }
    }
}
