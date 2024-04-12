

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

public class UserDataService
{

    private readonly IConfiguration _configuration;
    public UserDataService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Dictionary<string, string>> SetUserData(UserDataDto userData)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                var existsUser = context.Users.FirstOrDefault(t => t.Id == userData.UserId);
                if (existsUser == null)
                {
                    messages.Add("statusCode", "2");
                    messages.Add("message", "Nie znaleziono uzytkownika");
                    return messages;
                }


                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        UserData newUserData = new UserData
                        {
                            UserId = userData.UserId,
                            Weight = userData.Weight,
                            Height = userData.Height,
                            Age = userData.Age,
                            Sex = userData.Sex
                        };

                        context.UsersData.Add(newUserData);
                        await context.SaveChangesAsync();
                        await dbTransaction.CommitAsync();

                        messages.Add("statusCode", "0");
                        messages.Add("message", "Zmiany zostaly zapisane !!!");
                    }
                    catch (Exception ex)
                    {
                        await dbTransaction.RollbackAsync();
                        messages.Add("statusCode", "1");
                        messages.Add("message", "Wystapil blad podczas zapisu do bazy, sprobuj pozniej !!!");
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

}