using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.SqlServer;
using System.Globalization;

//var builder = WebApplication.CreateBuilder(args);

//// Dodaj us³ugi do kontenera
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//var configuration = new ConfigurationBuilder()
//    .AddJsonFile("appsettings.json")
//    .Build();

//app.UseCors(builder =>
//{
//    builder.WithOrigins("https://localhost:5173")
//           .AllowAnyMethod()
//           .AllowAnyHeader();
//});

//app.UseDefaultFiles();
//app.UseStaticFiles();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseAuthorization();

//app.MapControllers();
//app.MapFallbackToFile("/index.html");

//app.Run();

//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// Dodaj us³ugi do kontenera
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:5173")
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var tokenValidationParams = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = "yourIssuer",
    ValidAudience = "yourAudience",
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("yourSecretKey")) // Klucz prywatny
};

app.UseAuthentication(); // Dodaj middleware uwierzytelniania JWT
app.UseAuthorization(); // Dodaj middleware autoryzacji

app.Use(async (context, next) =>
{
    // SprawdŸ, czy nag³ówek Authorization zawiera token JWT
    var authHeader = context.Request.Headers["Authorization"].ToString();
    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
    {
        var token = authHeader.Substring("Bearer ".Length).Trim();

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            // Spróbuj zweryfikowaæ token JWT
            var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParams, out _);

            // Ustaw kontekst uwierzytelnienia na podstawie zweryfikowanego tokenu
            context.User = claimsPrincipal;
        }
        catch (Exception ex)
        {
            // Obs³u¿ b³¹d weryfikacji tokenu JWT
            Console.WriteLine($"B³¹d weryfikacji tokenu JWT: {ex.Message}");
        }
    }

    await next();
});

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();




