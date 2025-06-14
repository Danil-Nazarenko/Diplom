using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers
{
    public class CreateTopicDto
    {
        [Required]
        public string Title { get; set; }
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
                UserId = userId
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
        }
    }
}
