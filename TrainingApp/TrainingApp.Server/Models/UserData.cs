using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TrainingApp.Server.Models;

public partial class UserData
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }
    public float Height { get; set; }
    public float Weight { get; set; }
    public int Age { get; set; }
    public bool Sex { get; set; }
}