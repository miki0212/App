

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
                    messages.Add("message", "Login jest ju¿ zarejestrowany, wybierz inny !!!");
                    return messages;
                }

                if (existsEmail != null)
                {
                    messages.Add("statusCode", "2");
                    messages.Add("message", "Email jest ju¿ zarejestrowany, wybierz inny !!!");
                    return messages;
                }

                string hashedPassword = await HashedPassword(user.Password);


                using (var dbTransaction = context.Database.BeginTransaction()) {
                    try
                    {
                        User newUser = new User
                        {
                            Login = user.Login,
                            Imie = user.Name,
                            Nazwisko = user.Lastname,
                            Email = user.Email,
                            Haslo = hashedPassword
                        };

                        context.Users.Add(newUser);
                        await context.SaveChangesAsync();
                        await dbTransaction.CommitAsync();

                        messages.Add("statusCode", "0");
                        messages.Add("message", "Uzytkownik zosta³ zarejestrowany !!!");
                    }
                    catch (Exception ex)
                    {
                        await dbTransaction.RollbackAsync();
                        messages.Add("statusCode", "1");
                        messages.Add("message", "Wyst¹pi³ b³¹d podczas zapisu do bazy, spróbuj póŸniej !!!");
                    }
                }


            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "1");
                messages.Add("message", "Wyst¹pi³ b³¹d podczas dodawania u¿ytkownika !!! Spróbuj ponownie póŸniej !!!");
                return messages;
            }

        }

        return messages;
    }
    public async Task<string> LoginUser(){
        
        
        
        return "";
    }
    private async Task<string> HashedPassword(string password){
        using (SHA256 sha256Hash = SHA256.Create())
        {
            // Konwertuj has³o na tablicê bajtów
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

            // Konwertuj tablicê bajtów na ci¹g szesnastkowy
            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }

            return builder.ToString();
        }
    } 
}