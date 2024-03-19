using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TrainingApp.Server.Models;

public partial class User
{
    [Key]
    public int Id { get; set; }

    public string? Login { get; set; }
    public string? Imie { get; set; }
    public string? Nazwisko { get; set; }
    public string? Email { get; set; }
    public string? Haslo { get; set; }
}
