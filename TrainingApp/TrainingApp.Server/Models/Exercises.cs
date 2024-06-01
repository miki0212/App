using System.ComponentModel.DataAnnotations;

public class Exercises {
    [Key]
    public int Id { get; set; }
    public string ExerciseName { get; set; }
    public string? Difficult { get; set; }
    public string? Category { get; set; }
    public bool? Equipment { get; set; }
    public int Calories { get; set; }
}