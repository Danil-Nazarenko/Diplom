using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Имя пользователя и пароль обязательны");

            var result = _authService.Register(user);
            if (!result)
                return Conflict("Пользователь с таким именем уже существует");

            return Ok("Регистрация прошла успешно");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Имя пользователя и пароль обязательны");

            var token = _authService.Login(user.Username, user.Password);
            if (token == null)
                return Unauthorized("Неверное имя пользователя или пароль");

            return Ok(new { Token = token });
        }
    }
}
