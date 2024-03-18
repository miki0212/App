

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

public class UserService
{

    private readonly IConfiguration _configuration;
    public UserService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Dictionary<string, string>> RegisterUser(UserCredentials user)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {

            try
            {
                var existsUser = context.Users.FirstOrDefault(t => t.Login == user.Login);
                var existsEmail = context.Users.FirstOrDefault(t => t.Email == user.Email);

                if (existsUser != null)
                {
                    messages.Add("statusCode", "2");
                    messages.Add("message", "Login jest ju� zarejestrowany, wybierz inny !!!");
                    return messages;
                }

                if (existsEmail != null)
                {
                    messages.Add("statusCode", "2");
                    messages.Add("message", "Email jest ju� zarejestrowany, wybierz inny !!!");
                    return messages;
                }

                string hashedPassword = await HashedPassword(user.Password);

                User newUser = new User
                {
                    Login = user.Login,
                    Imie = user.Name,
                    Nazwisko = user.Lastname,
                    Email = user.Email,
                    Haslo = hashedPassword
                };

                context.Users.Add(newUser);
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "1");
                messages.Add("message", "Wyst�pi� b��d podczas dodawania u�ytkownika !!! Spr�buj ponownie p�niej !!1");
                return messages;
            }
            messages.Add("statusCode", "0");
            messages.Add("message", "Uzytkownik zosta� zarejestrowany !!!");
        }

        return messages;
    }
    private async Task<string> HashedPassword(string password){
        using (SHA256 sha256Hash = SHA256.Create())
        {
            // Konwertuj has�o na tablic� bajt�w
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

            // Konwertuj tablic� bajt�w na ci�g szesnastkowy
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }

            return builder.ToString();
        }
    } 
}