

using Microsoft.AspNetCore.Mvc;

public interface IAccountController 
{
    Task<IActionResult> RegisterUser(UserCredentials user);
    Task<IActionResult> LoginUser([FromBody] UserCredentials User);
}