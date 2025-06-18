using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers
{
    public class CreateTaskDto
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? Deadline { get; set; }
        public string Status { get; set; } = "not_started";
        public string Priority { get; set; } = "medium";
        [Required]
        public int TopicId { get; set; }
    }

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = new TaskModel
            {
                Title = dto.Title,
                Description = dto.Description,
                Deadline = dto.Deadline,
                Status = dto.Status,
                Priority = dto.Priority,
                TopicId = dto.TopicId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpGet("{topicId}")]
        public async Task<IActionResult> GetTasksByTopic(int topicId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.TopicId == topicId)
                .ToListAsync();

            return Ok(tasks);
        }

        // Новый метод обновления задачи по id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] CreateTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Deadline = dto.Deadline;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.TopicId = dto.TopicId;

            await _context.SaveChangesAsync();
            return Ok(task);
        }
    }
}
