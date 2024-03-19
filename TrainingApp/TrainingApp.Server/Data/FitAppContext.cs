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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
