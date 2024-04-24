using System.ComponentModel.DataAnnotations;

public class ExerciseFavorites
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ExerciseId { get; set; }
}