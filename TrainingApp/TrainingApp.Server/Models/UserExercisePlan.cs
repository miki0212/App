using System.ComponentModel.DataAnnotations;

public class UserExercisesPlan
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }
    public int ExerciseId { get; set; }
    public string Data { get; set; }
    public int RepetitionsNumber { get; set; }
}