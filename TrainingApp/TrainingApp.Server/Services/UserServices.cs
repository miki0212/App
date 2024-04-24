

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
    public async Task<Dictionary<string, string>> LoginUser   (UserCredentials user)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            string hashedPassword = await HashedPassword(user.Password);
            var existsUser = context.Users.FirstOrDefault(t => t.Login == user.Login && t.Haslo == hashedPassword).Id;

            if(existsUser == null)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "B³êdny login lub has³o !!!");
                return messages;
            }

            try
            {
                var token = GenerateToken(user.Login,existsUser);
                messages.Add("statusCode", "0");
                messages.Add("message", token);
            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Wystapil problem z logowaniem !!!");
                return messages;
            }
        }

        return messages;
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

    private string GenerateToken(string login,int id)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);



        var token = new JwtSecurityToken(
            issuer: "token",
            audience: "user",
            claims: new[] { new Claim("username", login), new Claim("id", id.ToString()) },
            expires: DateTime.Now.AddMinutes(20),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}