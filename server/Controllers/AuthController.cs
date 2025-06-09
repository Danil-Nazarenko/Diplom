using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            try
            {
                var user = await _authService.RegisterAsync(model.Username, model.Email, model.Password);

                // Генерация JWT токена сразу после регистрации
                var token = _authService.GenerateJwtToken(user);

                return Ok(new { message = "Регистрация прошла успешно!", token, userId = user.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest("Некорректные данные.");

            var (token, user) = _authService.LoginWithUser(model.Username, model.Password);
            if (token == null || user == null)
                return Unauthorized(new { message = "Неверный логин или пароль" });

            return Ok(new { token, userId = user.Id });
        }
    }
}
