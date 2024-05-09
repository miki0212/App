

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System.Collections.Generic;
using System.Drawing.Printing;
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

    public async Task<Dictionary<string, UserDataDto>> GetUserData(int UserId)
    {
        Dictionary<string, UserDataDto> messages = new Dictionary<string, UserDataDto>();
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                var existsUser = context.Users.FirstOrDefault(t => t.Id == UserId);
                if (existsUser == null)
                {
                    return null;
                }

                UserData existsUserData = context.UsersData.FirstOrDefault(t => t.UserId == UserId);
                

                if (existsUserData != null)
                {
                    UserDataDto userDataDto = new UserDataDto()
                    {
                        UserId = UserId,
                        Name = existsUser.Imie,
                        Lastname = existsUser.Nazwisko,
                        Age = existsUserData.Age,
                        Weight = existsUserData.Weight,
                        Height = existsUserData.Height,
                        Sex = existsUserData.Sex,
                    };
                    messages.Add("UserData", userDataDto);
                    return messages;
                }
                else {
                    messages.Add("UserData", null);
                }
            }
            catch (Exception ex) {
                throw new Exception();
            }
        }
        return messages;
    }

    public async Task<Dictionary<string, List<Exercises>>> GetExercisesPage(int pageNumber){
        Dictionary<string, List<Exercises>> exercisesMessage = new Dictionary<string, List<Exercises>>();
        int pageSize = 6;
        List<Exercises> exercisesList = null;
        if (pageNumber > await GetMaxExercisesPage(pageSize)) {
            exercisesMessage.Add("messagge", exercisesList);
            return exercisesMessage;
        }

        using (FitAppContext context = new FitAppContext(_configuration)) {
            exercisesList =  context.Exercises.OrderBy(e => e.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            int totalExercisesRecords = context.Exercises.Count();
            int totalExercisesPage= (int)Math.Ceiling((double)totalExercisesRecords / pageSize);
            exercisesMessage.Add("message", exercisesList);
            return exercisesMessage;
        }
    }

    public async Task<Dictionary<string, List<Exercises>>> GetExerciseByName(string searchString)
    {
        Dictionary<string, List<Exercises>> exercisesMessage = new Dictionary<string, List<Exercises>>();
        List<Exercises> exercisesList = null;
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            exercisesList = context.Exercises.Where(e => e.ExerciseName.StartsWith(searchString)).OrderBy(e => e.ExerciseName).Take(10).ToList();
            exercisesMessage.Add("message", exercisesList);

            return exercisesMessage;
        }
    }

    public async Task<int> GetMaxExercisesPage(int pageSize) {
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            int totalExercisesRecords = context.Exercises.Count();
            int totalExercisesPage = (int)Math.Ceiling((double)totalExercisesRecords / pageSize);

            return totalExercisesPage;
        }
    }

    public async Task<Dictionary<string, bool>> AddRemoveFavouriteExercise(DtoExercisesFavourites exerciseFavourites)
    {
        Dictionary<string,bool> exercisesMessage = new Dictionary<string, bool>();
        List<Exercises> exercisesList = null;
   

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            var exerciseExistsInFavourites = context.ExerciseFavorites.FirstOrDefault(e => e.UserId == exerciseFavourites.UserId && e.ExerciseId == exerciseFavourites.ExerciseId);
            if (exerciseExistsInFavourites != null)
            {
                //Remove from exists
                context.ExerciseFavorites.Remove(exerciseExistsInFavourites);
                exercisesMessage.Add("message", false);
            }
            else {
                ExerciseFavorites exerciseFavorites = new ExerciseFavorites()
                {
                    UserId = exerciseFavourites.UserId,
                    ExerciseId = exerciseFavourites.ExerciseId
                };
                context.ExerciseFavorites.Add(exerciseFavorites);
                exercisesMessage.Add("message", true);
            }

            context.SaveChanges();

            return exercisesMessage;
        }
    }

    public async Task<Dictionary<string, bool>> CheckFavouriteExercises(DtoExercisesFavourites exerciseFavourites)
    {
        Dictionary<string, bool> exercisesMessage = new Dictionary<string, bool>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            var existsFavouriteExercises = context.ExerciseFavorites.FirstOrDefault(e => e.UserId == exerciseFavourites.UserId && e.ExerciseId == exerciseFavourites.ExerciseId);
            
            if (existsFavouriteExercises != null)
            {
                exercisesMessage.Add("message", true);
            }
            else 
            {
                exercisesMessage.Add("message", false);
            }
            return exercisesMessage;
        }
    }

    public async Task<Dictionary<string, bool>> GetUserExercisesPlan(int UserId,string date)
    {
        string dateFormat = "yyyy-MM-dd";
        DateTime dateTime = DateTime.Now; // Przykładowa data i czas
        string formattedDate = dateTime.ToString(dateFormat);

        Dictionary<string, bool> exercisesMessage = new Dictionary<string, bool>();
        return exercisesMessage;
    }

    public async Task<Dictionary<string, bool>> AddUserExercisesPlan(DtoExercisesAddPlan newExercises)
    {
        string dateFormat = "yyyy-MM-dd";

        //Today date
        DateTime dateTime = DateTime.Now;
        string formattedDate = dateTime.ToString(dateFormat);
        Dictionary<string, bool> exercisesMessage = new Dictionary<string, bool>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            UserExercisesPlan userExercisesPlan = new UserExercisesPlan()
            {
                Data = formattedDate,
                ExerciseId = newExercises.ExerciseId,
                UserId = newExercises.UserId,
                RepetitionsNumber = newExercises.Repeat
            };
            context.UserExercisesPlan.Add(userExercisesPlan);   
            context.SaveChanges();

            exercisesMessage.Add("message", true);
            return exercisesMessage;
        }
    }

    public async Task<Dictionary<string,List<ExerciseOne>>> GetUserExercisesPlan(int UserId)
    {
        Dictionary<string, List<ExerciseOne>> exercisesMessage = new Dictionary<string, List<ExerciseOne>>();
        string dateFormat = "yyyy-MM-dd";
        DateTime dateTime = DateTime.Now; // Przykładowa data i czas
        string formattedDate = dateTime.ToString(dateFormat);

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            //var userPlan = context.UserExercisesPlan.Where(e => e.UserId == UserId && e.Data.Equals(formattedDate)).ToList();
            var userPlan = context.UserExercisesPlan.Where(e => e.UserId == UserId).ToList();
            List<ExerciseOne> exerciseList = new List<ExerciseOne>();
            foreach(var exercise in userPlan)
            {
                var exercises = context.Exercises.FirstOrDefault(e=>e.Id==exercise.ExerciseId);
                ExerciseOne exerciseOne = new ExerciseOne()
                {
                    ExerciseName = exercises.ExerciseName,
                    Repeat = exercise.RepetitionsNumber
                };
                exerciseList.Add(exerciseOne);
            }

            exercisesMessage.Add("message", exerciseList);

            return exercisesMessage;
        }
    }
}