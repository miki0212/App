//using Microsoft.EntityFrameworkCore;
//using System.Data.Entity.ModelConfiguration.Conventions;
//using Microsoft.Extensions.Options;

//public class AppDbContext : DbContext
//{
//    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
//    {
        
//    }

//    public DbSet<User> User { get; set; }

//    public bool IsDatabaseConnected()
//    {
//        try
//        {
//            return User.Any();
//          // MyEntities to DbSet w Twoim kontekœcie
//        }
//        catch
//        {
//            return false;
//        }
//    }

//    //protected override void OnModelCreating(ModelBuilder modelBuilder)
//    //{
//    //    base.OnModelCreating(modelBuilder);
//    //}
//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//    {
//        if (!optionsBuilder.IsConfigured)
//        {
//            optionsBuilder.UseSqlServer("Server=localhost;Database=FitApp;Trusted_Connection=True;");
//        }
//    }
//}