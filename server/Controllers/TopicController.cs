using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System;

namespace server.Controllers
{
    public class CreateTopicDto
    {
        [Required]
        public string Title { get; set; }

        public DateTime? Deadline { get; set; } 
    }

    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TopicsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTopics()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var topics = await _context.Topics
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return Ok(topics);
        }

        // Новый метод для получения темы по ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTopicById(int id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var topic = await _context.Topics
                .Where(t => t.UserId == userId && t.Id == id)
                .FirstOrDefaultAsync();

            if (topic == null)
                return NotFound();

            return Ok(topic);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTopic([FromBody] CreateTopicDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var topic = new TopicModel
            {
                Title = dto.Title,
                UserId = userId,
                Deadline = dto.Deadline 
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
        }
    }
}
