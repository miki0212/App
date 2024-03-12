using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        //private readonly AppDbContext _dbContext;
        public UserController(ILogger<WeatherForecastController> logger)
        {
            //_dbContext = dbContext;
        }

        [HttpPost(Name = "registerUser")]
        public async Task<bool> RegisterUser(string login,string password)
        {

            using (FitAppContext context = new FitAppContext()) 
            {
                var newUser = new User
                {
                    Login = login,
                    Imie = "Antoni",
                    Nazwisko = "Testowy",
                    Email = "antoni.testowy@wp.pl",
                    Haslo = "12345"
                };

                context.Users.Add(newUser);
                context.SaveChanges();
            }
       


            ////string connectionString = "Server=localhost\\MSSQLSERVER01;Database=FitApp;Trusted_Connection=True;";
            //string connectionString = "Server=localhost\\MSSQLSERVER01;Database=FitApp;Integrated Security=True;Trusted_Connection=True;";


            //// Dane do wstawienia
            ////string login1 = "john_doe";
            //string email = "john.doe@example.com";
            ////string password = "securepassword";

            //// Zapytanie SQL
            //string insertQuery = "INSERT INTO [User] (Login, Email, Haslo) VALUES (@Login, @Email, @Haslo)";

            //using (SqlConnection connection = new SqlConnection(connectionString))
            // {
            //    try
            //    {
            //        connection.Open();

            //        // Tworzenie obiektu SqlCommand
            //        using (SqlCommand command = new SqlCommand(insertQuery, connection))
            //        {
            //            // Dodawanie parametrów do zapytania SQL
            //            command.Parameters.AddWithValue("@Login", login);
            //            command.Parameters.AddWithValue("@Email", email);
            //            command.Parameters.AddWithValue("@Haslo", password);

            //            // Wykonanie zapytania
            //            int rowsAffected = command.ExecuteNonQuery();

            //            Console.WriteLine("Liczba wstawionych rekordów: " + rowsAffected);
            //        }
            //    }
            //    catch (Exception ex)
            //    {
            //        Console.WriteLine("B³¹d: " + ex.Message);
            //    }
            //}


            Console.WriteLine($"Dodano uzytkownika : {login}");
            return true;
        }
    }
}
