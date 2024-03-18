

using Microsoft.AspNetCore.Mvc;

public interface IUserController 
{
    Task<IActionResult> RegisterUser(UserCredentials user);
}