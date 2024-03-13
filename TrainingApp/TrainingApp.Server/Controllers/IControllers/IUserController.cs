

public interface IUserController 
{
    Task<bool> RegisterUser(string login, string imie, string nazwisko, string email, string password);
}