using System.ComponentModel.DataAnnotations;

public class UserMealHistory
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MealId { get; set; }
    public string? Date { get; set; }
    public int Weight { get; set; }
}