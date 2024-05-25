using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using TrainingApp.Server.Data;
using TrainingApp.Server.Models;

public class MealService
{

    private readonly IConfiguration _configuration;
    private readonly ILogger<MealService> _logger;
    public MealService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Dictionary<string, string>> GetMealMaxPage(int mealPerPage)
    {
        Dictionary<string, string> messages = new Dictionary<string, string>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                int mealCounter = context.Meals.Count();
                int totalMealsPage = (int)Math.Ceiling((double)mealCounter / mealPerPage);

                messages.Add("statusCode", "0");
                messages.Add("message", totalMealsPage.ToString());

                return messages;

            }
            catch (Exception ex)
            {
                messages.Add("statusCode", "2");
                messages.Add("message", "Wystapil blad serwera !!!");
            }

        }

        return messages;
    }

    public async Task<Dictionary<string, List<Meals>>> GetMealPage(int pageNumber)
    {
        Dictionary<string, List<Meals>> responseMessage = new Dictionary<string, List<Meals>>();
        int pageSize = 6;
        List<Meals> mealList = new List<Meals>();

        Dictionary<string, string> mealsPage = await GetMealMaxPage(pageSize);

        mealsPage.TryGetValue("statusCode", out string statusCode);
        mealsPage.TryGetValue("message", out string mealsMaxPage);


        if (statusCode != "0") {
            responseMessage.Add("messagge", mealList);
            return responseMessage;
        }

        if (pageNumber > int.Parse(mealsMaxPage)) {
            responseMessage.Add("messagge", mealList);
            return responseMessage;
        }

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                var e = context.Meals.OrderBy(e => e.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                mealList = context.Meals.OrderBy(e => e.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                int totalMealsRecords = context.Exercises.Count();
                //int totalExercisesPage = (int)Math.Ceiling((double)totalMealsRecords / pageSize);
                responseMessage.Add("message", mealList);
                return responseMessage;
            }catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return responseMessage;
            }
        }
    }

    public async Task<Dictionary<string, List<UserMealHistoryDto>>> GetUserMealHistory()
    {
        Dictionary<string, List<UserMealHistoryDto>> responseMessage = new Dictionary<string, List<UserMealHistoryDto>>();

        List<UserMealHistoryDto> mealList = new List<UserMealHistoryDto>();

        List<UserMealHistory> meals = new List<UserMealHistory>();

        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            try
            {
                meals = context.UserMealHistory.Where(e => e.Date == currentDate).ToList();

                foreach (var meal in meals) {
                    string mealName = context.Meals.First(e => e.Id == meal.MealId).MealName;
                    float calories = context.Meals.First(e => e.Id == meal.MealId).Calories;

                    double weight = (double)meal.Weight / 100;

                    double mealCalories = calories * weight;

                    UserMealHistoryDto item = new UserMealHistoryDto()
                    {
                        calories = mealCalories,
                        mealName = mealName
                    };

                    mealList.Add(item);
                }
                responseMessage.Add("message", mealList);
                return responseMessage;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return responseMessage;
            }
        }
    }

    public async Task<Dictionary<string, List<Meals>>> GetMealByName(string searchString)
    {
        Dictionary<string, List<Meals>> message = new Dictionary<string, List<Meals>>();
        List<Meals> mealList = null;

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            mealList = context.Meals.Where(e => e.MealName.StartsWith(searchString)).OrderBy(e => e.MealName).Take(10).ToList();
            message.Add("message", mealList);

            return message;
        }
    }

    public async Task<Dictionary<string, bool>> AddUserMealHistory(UserMealHistory newMeal)
    {
        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        //Today date
        DateTime dateTime = DateTime.Now;

        Dictionary<string, bool> message = new Dictionary<string, bool>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            UserMealHistory userMealHistoryItem = new UserMealHistory()
            {
                UserId = newMeal.UserId,
                MealId = newMeal.MealId,
                Date = currentDate,
                Weight = newMeal.Weight
            };
            context.UserMealHistory.Add(userMealHistoryItem);
            context.SaveChanges();

            message.Add("message", true);
            return message;
        }
    }
    public async Task<Dictionary<string, double>> CalculateCalories(int userId)
    {
        string currentDate = DateTime.Now.ToString("dd-MM-yyyy");

        //Today date
        DateTime dateTime = DateTime.Now;

        Dictionary<string, double> message = new Dictionary<string, double>();

        using (FitAppContext context = new FitAppContext(_configuration))
        {
            List<UserMealHistory> meals = context.UserMealHistory.Where(e => e.Date == currentDate && e.UserId == userId).ToList();
            double caloriesSum = 0;
            foreach (var meal in meals)
            {
                string mealName = context.Meals.First(e => e.Id == meal.MealId).MealName;
                float calories = context.Meals.First(e => e.Id == meal.MealId).Calories;

                double weight = (double)meal.Weight / 100;

                double mealCalories = calories * weight;
                caloriesSum += mealCalories;
            }

            message.Add("message", caloriesSum);
            return message;
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
