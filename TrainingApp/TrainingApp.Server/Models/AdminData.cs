using System.ComponentModel.DataAnnotations;

public class AdminData
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Lastname { get; set; }
    public string Login{ get; set; }
    public string Password{ get; set; }
}