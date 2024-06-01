

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
                else
                {
                    messages.Add("UserData", null);
                }
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }
        return messages;
    }

    public async Task<Dictionary<string, List<Exercises>>> GetExercisesPage(int pageNumber)
    {
        Dictionary<string, List<Exercises>> exercisesMessage = new Dictionary<string, List<Exercises>>();
        int pageSize = 6;
        List<Exercises> exercisesList = null;
        if (pageNumber > await GetMaxExercisesPage(pageSize))
        {
            exercisesMessage.Add("messagge", exercisesList);
            return exercisesMessage;
        }

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            exercisesList = context.Exercises.OrderBy(e => e.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            int totalExercisesRecords = context.Exercises.Count();
            int totalExercisesPage = (int)Math.Ceiling((double)totalExercisesRecords / pageSize);
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

    public async Task<int> GetMaxExercisesPage(int pageSize)
    {
        using (FitAppContext context = new FitAppContext(_configuration))
        {
            int totalExercisesRecords = context.Exercises.Count();
            int totalExercisesPage = (int)Math.Ceiling((double)totalExercisesRecords / pageSize);

            return totalExercisesPage;
        }
    }

    public async Task<Dictionary<string, bool>> AddRemoveFavouriteExercise(DtoExercisesFavourites exerciseFavourites)
    {
        Dictionary<string, bool> exercisesMessage = new Dictionary<string, bool>();
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
            else
            {
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

    public async Task<Dictionary<string, bool>> GetUserExercisesPlan(int UserId, string date)
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

        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            UserExercisesPlan userExercisesPlan = new UserExercisesPlan()
            {
                Data = currentDate,
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

    public async Task<Dictionary<string, List<ExerciseOne>>> GetUserExercisesPlan(int UserId)
    {
        Dictionary<string, List<ExerciseOne>> exercisesMessage = new Dictionary<string, List<ExerciseOne>>();
        string dateFormat = "yyyy-MM-dd";
        DateTime dateTime = DateTime.Now; // Przykładowa data i czas
        string formattedDate = dateTime.ToString(dateFormat);

        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            //var userPlan = context.UserExercisesPlan.Where(e => e.UserId == UserId && e.Data.Equals(formattedDate)).ToList();
            var userPlan = context.UserExercisesPlan.Where(e => e.UserId == UserId && e.Data == currentDate).ToList();
            List<ExerciseOne> exerciseList = new List<ExerciseOne>();
            foreach (var exercise in userPlan)
            {
                var exercises = context.Exercises.FirstOrDefault(e => e.Id == exercise.ExerciseId);
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
    public async Task<Dictionary<string, double>> CalculateExerciseCalories(int userId)
    {
        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        //Today date
        DateTime dateTime = DateTime.Now;

        Dictionary<string, double> message = new Dictionary<string, double>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            List<UserExercisesPlan> exercisesList = context.UserExercisesPlan.Where(e => e.Data == currentDate && e.UserId == userId).ToList();

            double caloriesSum = 0;

            foreach (var exercise in exercisesList)
            {
                float calories = context.Exercises.First(e => e.Id == exercise.ExerciseId).Calories;

                double mealCalories = (double)exercise.RepetitionsNumber * calories;

                //double mealCalories = calories * weight;
                caloriesSum += mealCalories;
            }

            message.Add("message", caloriesSum);
            return message;
        }
    }

    public async Task<Dictionary<string,DtoUserRankingList>> GetExercisesUserRanking(int userId, int showTop)
    {
        showTop = 6;
        DtoUserRankingList list = new DtoUserRankingList();
        list.UserRanking = new List<DtoUserRanking>();

        Dictionary<string, DtoUserRankingList> message = new Dictionary<string, DtoUserRankingList>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {

            List<User> usersId = context.Users.ToList();

            //List<DtoUserRanking> userRankings = new List<DtoUserRanking>();

            int userRankingCounter = 1;
            int myRanking = 1;

            //Obliczanie kalorii dla kazdego uzytkownia
            foreach (var user in usersId)
            {
                userRankingCounter++;

                Dictionary<string, double> status = await CalculateExerciseCalories(user.Id);
                status.TryGetValue("message", out double userCalories);

                DtoUserRanking dtoUserRanking = new DtoUserRanking()
                {
                    Id = user.Id,
                    Login = user.Login,
                    Calories = userCalories,
                    Position = 0
                };

                list.UserRanking.Add(dtoUserRanking);

                //Posortowany ranking uzytkownikow
                list.UserRanking = list.UserRanking.OrderByDescending(user => user.Calories).ThenBy(user => user.Login).ToList();
            }
            int myRank = list.UserRanking.FindIndex(e => e.Id == userId) + 1;
            list.MyRank = myRank;

            list.UserRanking = list.UserRanking.OrderByDescending(user => user.Calories).Take(showTop).ToList();

            message.Add("message", list);
            return message;
        }
    }

}