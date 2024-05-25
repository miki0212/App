using System.ComponentModel.DataAnnotations;

namespace TrainingApp.Server.Models;

public class Meals
{
    [Key]
    public int Id { get; set; }

    public string MealName { get; set; }
    public int Calories { get; set; }
    public int? Carbohydrates { get; set; }
    public int? Protein { get; set; }
    public int? Fat { get; set; }
    public int? Fiber { get; set; }
}
