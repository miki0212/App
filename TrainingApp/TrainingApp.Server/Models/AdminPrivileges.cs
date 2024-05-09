using System.ComponentModel.DataAnnotations;

public class AdminPrivileges
{
    [Key]
    public int Id { get; set; }
    public int AdminId { get; set; }
    public bool CreateAdmin { get; set; }
    public bool CreateExercise { get; set; }
    public bool CreateMeal { get; set; }
    public bool BlockUser { get; set; }
    public bool DeleteUserAccount { get; set; }
}