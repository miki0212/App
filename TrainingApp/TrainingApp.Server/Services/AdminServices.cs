using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

public class AdminService
{

    private readonly IConfiguration _configuration;
    public AdminService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Dictionary<string, string>> RegisterAdmin(DtoAdminData admin)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                var existsUser = context.AdminData.FirstOrDefault(t => t.Login == admin.Login);
                //var existsEmail = context.AdminData.FirstOrDefault(t => t.Email == admin.Email);

                if (existsUser != null)
                {
                    messages.Add("statusCode", "2");
                    messages.Add("message", "Login jest już zarejestrowany, wybierz inny !!!");
                    return messages;
                }

                //if (existsEmail != null)
                //{
                //    messages.Add("statusCode", "2");
                //    messages.Add("message", "Email jest już zarejestrowany, wybierz inny !!!");
                //    return messages;
                //}

                string hashedPassword = await HashedPassword(admin.Password);


                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        AdminData newAdmin = new AdminData
                        {
                            Login = admin.Login,
                            Name = admin.Name,
                            Lastname = admin.Lastname,
                            Password = hashedPassword,
                        };

                        context.AdminData.Add(newAdmin);
                        await context.SaveChangesAsync();
                        await dbTransaction.CommitAsync();

                        messages.Add("statusCode", "0");
                        messages.Add("message", "Uzytkownik został zarejestrowany !!!");
                    }
                    catch (Exception ex)
                    {
                        await dbTransaction.RollbackAsync();
                        messages.Add("statusCode", "1");
                        messages.Add("message", "Wystąpił błąd podczas zapisu do bazy, spróbuj później !!!");
                    }
                }


            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "1");
                messages.Add("message", "Wystąpił błąd podczas dodawania użytkownika !!! Spróbuj ponownie później !!!");
                return messages;
            }

        }

        return messages;
    }
    public async Task<Dictionary<string, string>> LoginAdmin(DtoAdminCredentials admin)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            string hashedPassword = await HashedPassword(admin.Password);
            var existsAdmin = context.AdminData.FirstOrDefault(t => t.Login == admin.Login && t.Password == hashedPassword);

            if (existsAdmin == null)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Błędny login lub hasło !!!");
                return messages;
            }

            try
            {
                int existAdminId = existsAdmin.Id;
                var token = GenerateToken(admin.Login, existAdminId);
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

    public async Task<Dictionary<string, string>> GetAdminPrivileges(int adminId)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            var existsAdmin = context.AdminData.FirstOrDefault(t => t.Id == adminId);

            if (existsAdmin == null)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Admin nie istnieje !!!");
                return messages;
            }

            try
            {
                var adminPrivileges = context.AdminPrivileges.FirstOrDefault(t => t.Id == adminId);
                DtoAdminPrivileges dtoAdminPrivileges = new DtoAdminPrivileges()
                {
                    BlockUser = adminPrivileges.BlockUser,
                    CreateAdmin = adminPrivileges.CreateAdmin,
                    CreateExercise = adminPrivileges.CreateExercise,
                    CreateMeal = adminPrivileges.CreateMeal,
                    DeleteUserAccount = adminPrivileges.DeleteUserAccount
                };
                var dtoPrivileges = JsonSerializer.Serialize(dtoAdminPrivileges);
                messages.Add("statusCode", "0");
                messages.Add("message", dtoPrivileges);
            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Wystapil problem z pobraniem uprawnien !!!");
                return messages;
            }
        }

        return messages;
    }

    public async Task<Dictionary<string, string>> AddAdminExercise(DtoNewExercise newExercise)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            var existsAdmin = context.AdminData.FirstOrDefault(t => t.Id == newExercise.AdminId);

            //Check admin exists
            if (existsAdmin == null)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Admin nie istnieje !!!");
                return messages;
            }

            //Check privileges
            var adminPrivileges = context.AdminPrivileges.FirstOrDefault(t => t.Id == newExercise.AdminId).CreateExercise;
            if (!adminPrivileges)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Nie masz uprawnien do dodania cwiczenia !!!");
                return messages;
            }

            try
            {
                Exercises exercises = new Exercises()
                {
                    ExerciseName = newExercise.ExerciseName,
                    Category = newExercise.Category,
                    Difficult = newExercise.Difficult,
                    Equipment = newExercise.Equipment,
                };

                context.Exercises.Add(exercises);
                context.SaveChanges();

                messages.Add("statusCode", "0");
                messages.Add("message", "Cwiczenie zostalo dodane !!!");
            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Wystapil problem z pobraniem uprawnien !!!");
                return messages;
            }
        }

        return messages;
    }

    public async Task<Dictionary<string, string>> GetAdminUserList(int adminId, int pageNumber)
    {
        int pageSize = 6;
        int maxUserPage = await GetMaxUserPage();

        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            var userList = context.Exercises.OrderBy(e => e.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            if (userList.Count > 0)
            {
                var userListSerialize = JsonSerializer.Serialize(userList);
                messages.Add("statusCode", "1");
                messages.Add("message", userListSerialize);
            }
            else
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Blad pobierania strony uzytkownikow !!!");
                return messages;
            }
        }
        return messages;
    }

    public async Task<int> GetMaxUserPage()
    {
        int pageSize = 6;

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            int totalExercisesRecords = context.Users.Count();
            int totalExercisesPage = (int)Math.Ceiling((double)totalExercisesRecords / pageSize);

            return totalExercisesPage;
        }
    }
    private async Task<string> HashedPassword(string password)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }

            return builder.ToString();
        }
    }

    private string GenerateToken(string login, int id)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "token",
            audience: "user",
            claims: new[] {
                new Claim("username", login),
                new Claim("id", id.ToString()),
                new Claim("accountType", "Admin")
            },
            expires: DateTime.Now.AddMinutes(20),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
