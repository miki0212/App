using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TrainingApp.Server.Models;

namespace TrainingApp.Server.Data;

public partial class FitAppContext : DbContext
{
    private readonly IConfiguration _configuration;
    public FitAppContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public FitAppContext()
    {
    }

    public FitAppContext(DbContextOptions<FitAppContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserData> UsersData { get; set; }
    public virtual DbSet<Exercises> Exercises { get; set; }
    public virtual DbSet<ExerciseFavorites> ExerciseFavorites { get; set; }
    public virtual DbSet<UserExercisesPlan> UserExercisesPlan { get; set; }
    public virtual DbSet<AdminData> AdminData { get; set; }
    public virtual DbSet<AdminPrivileges> AdminPrivileges { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer(_configuration["ConnectionStrings"]);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Login)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Imie)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Nazwisko)
               .HasMaxLength(50)
               .IsUnicode(false);

            entity.Property(e => e.Email)
              .HasMaxLength(150)
              .IsUnicode(false);

            entity.Property(e => e.Haslo)
              .HasMaxLength(255)
              .IsUnicode(false);

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<UserData>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId);

            entity.Property(e => e.Height).HasColumnType("float");

            entity.Property(e => e.Weight).HasColumnType("float");

            entity.Property(e => e.Age);

            entity.Property(e => e.Sex);

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Exercises>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.ExerciseName);

            entity.Property(e => e.Difficult);

            entity.Property(e => e.Category);

            entity.Property(e => e.Equipment);
        });

        modelBuilder.Entity<ExerciseFavorites>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId);

            entity.Property(e => e.ExerciseId);
        });


        modelBuilder.Entity<UserExercisesPlan>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserId);

            entity.Property(e => e.ExerciseId);

            entity.Property(e => e.Data);

            entity.Property(e => e.RepetitionsNumber);
        });

        modelBuilder.Entity<AdminData>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Login);

            entity.Property(e => e.Name);

            entity.Property(e => e.Lastname);

            entity.Property(e => e.Password);
        });

        modelBuilder.Entity<AdminPrivileges>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.AdminId);

            entity.Property(e => e.CreateAdmin);

            entity.Property(e => e.CreateExercise);

            entity.Property(e => e.CreateMeal);

            entity.Property(e => e.BlockUser);

            entity.Property(e => e.DeleteUserAccount);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
