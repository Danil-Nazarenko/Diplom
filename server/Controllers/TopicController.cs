using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
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
            var userId = User.FindFirst("id")?.Value;

            if (userId == null)
                return Unauthorized();

            var topics = await _context.Topics
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return Ok(topics);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTopic([FromBody] TopicModel topic)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;

            if (userId == null)
                return Unauthorized();

            topic.UserId = userId;

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
        }
    }
}
