using Microsoft.AspNetCore.Mvc;
using server.Ai;
using server.Data;
using server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using System.Globalization;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;
        private readonly AppDbContext _context;

        public AiController(AiService aiService, AppDbContext context)
        {
            _aiService = aiService;
            _context = context;
        }

        [HttpGet("generate-tasks")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateTasks([FromQuery] int topicId)
        {
            var topic = await _context.Topics
                .FirstOrDefaultAsync(t => t.Id == topicId);

            Console.WriteLine($"[GenerateTasks] Запрос подзадач для темы с Id={topicId}, найдено: {(topic != null)}");

            if (topic == null)
            {
                Console.WriteLine($"[GenerateTasks] Тема с Id {topicId} не найдена");
                return NotFound("Тема не найдена");
            }

            var deadlineStr = topic.Deadline.HasValue
                ? $" с дедлайном {topic.Deadline.Value:dd MMMM yyyy}"
                : "";

            var prompt = $"Ты — интеллектуальный помощник. Все ответы давай **строго на русском языке**. " +
                $"Пользователь создал тему: «{topic.Title}»{deadlineStr}. " +
                "Если указан дедлайн всей темы — **распредели дедлайны подзадач равномерно до этого срока**. " +
                "Составь **строго от 3 до 7** кратких и конкретных подзадач для выполнения этой темы. " +
                "Ответ — это **только нумерованный список**, где **каждая строка содержит три поля**, разделённые вертикальной чертой '|':\n" +
                "**Название подзадачи | дедлайн (в формате дд.мм.гггг или пусто) | приоритет (Высокий, Средний, Низкий)**.\n" +
                "Пример (не повторяй его — составь свой список подзадач):\n" +
                "1. Исследовать тему | 20.06.2025 | Средний\n" +
                "2. Составить план | 21.06.2025 | Высокий\n" +
                "3. Разделить задачи | 22.06.2025 | Средний\n" +
                "4. Выполнить подзадачи | 23.06.2025 | Высокий\n" +
                "5. Проверить результат | 24.06.2025 | Средний\n" +
                "6. Сдать проект | | Высокий\n\n" +
                "**Строго соблюдай формат**. Не добавляй никаких пояснений, комментариев, приветствий или лишнего текста. Только список в указанном формате.";

            string responseText;
            try
            {
                responseText = await _aiService.GenerateTextAsync(prompt);
                Console.WriteLine("[GenerateTasks] Ответ ИИ:\n" + responseText);
            }
            catch (Exception ex)
            {
                Console.WriteLine("[GenerateTasks] Ошибка генерации текста: " + ex.Message);
                return StatusCode(500, $"Ошибка генерации текста: {ex.Message}");
            }

            var lines = responseText
                .Split('\n')
                .Select(l => l.Trim())
                .Where(l => Regex.IsMatch(l, @"^\d+\.\s+"))
                .ToList();

            if (lines.Count == 0)
            {
                Console.WriteLine("[GenerateTasks] Ответ ИИ не содержит корректного списка подзадач");
                return BadRequest("Ответ ИИ не содержит корректного списка подзадач.");
            }

            var newTasks = new List<TaskModel>();
            var dateFormats = new[] { "dd.MM.yyyy", "d.M.yyyy" };

            foreach (var line in lines)
            {
                var content = Regex.Replace(line, @"^\d+\.\s+", "");
                var parts = content.Split('|').Select(p => p.Trim()).ToArray();

                if (parts.Length != 3)
                {
                    Console.WriteLine($"[GenerateTasks] Пропущена строка с неверным форматом: {content}");
                    continue;
                }

                var title = parts[0];
                var deadlineText = parts[1];
                var priorityText = parts[2];

                DateTime? deadline = null;
                if (!string.IsNullOrWhiteSpace(deadlineText))
                {
                    if (DateTime.TryParseExact(deadlineText, dateFormats, CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out DateTime parsedDate))
                    {
                        deadline = DateTime.SpecifyKind(parsedDate, DateTimeKind.Utc);
                    }
                    else
                    {
                        Console.WriteLine($"[GenerateTasks] Невалидный формат даты: {deadlineText}");
                    }
                }

                var priority = priorityText.ToLower() switch
                {
                    "высокий" => "High",
                    "средний" => "Medium",
                    "низкий" => "Low",
                    _ => "Medium"
                };

                newTasks.Add(new TaskModel
                {
                    Title = title,
                    Description = "",
                    TopicId = topicId,
                    Status = "not_started",
                    Priority = priority,
                    Deadline = deadline
                });
            }

            _context.Tasks.AddRange(newTasks);
            await _context.SaveChangesAsync();

            Console.WriteLine($"[GenerateTasks] Создано задач: {newTasks.Count}");

            // DTO без циклов
            var dtoTasks = newTasks.Select(t => new GeneratedTaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Priority = t.Priority,
                Deadline = t.Deadline,
                Status = t.Status
            }).ToList();

            return Ok(new { tasks = dtoTasks, rawResponse = responseText });
        }
    }

    // DTO-модель
    public class GeneratedTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Status { get; set; } = "";
        public string Priority { get; set; } = "";
        public DateTime? Deadline { get; set; }
    }
}
