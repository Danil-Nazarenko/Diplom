using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<TopicModel> Topics { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.Topic)
                .WithMany(topic => topic.Tasks)
                .HasForeignKey(t => t.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskModel>()
                .Property(t => t.Priority)
                .IsRequired();

            modelBuilder.Entity<TaskModel>()
                .Property(t => t.Status)
                .IsRequired();
        }
    }
}
