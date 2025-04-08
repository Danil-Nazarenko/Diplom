using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data  // Убедись, что неймспейс правильный
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Здесь ты определяешь DbSet для каждой таблицы в базе данных
        // Пример: 
        public DbSet<User> Users { get; set; }

        // Здесь ты можешь добавить другие таблицы, как свойства DbSet, например:
        // public DbSet<Task> Tasks { get; set; }
    }
}
