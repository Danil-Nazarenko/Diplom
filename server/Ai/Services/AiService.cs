using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using LLama;
using LLama.Common;
using LLama.Sampling;

namespace server.Ai
{
    public class AiService : IDisposable
    {
        private LLamaWeights? _model;
        private LLamaContext? _context;
        private InteractiveExecutor? _executor;

        private readonly string _modelPath;
        private readonly ModelParams _modelParams;

        // Добавляем семафор с максимальным числом одновременных исполнений = 1
        private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public AiService()
        {
            _modelPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Ai", "ModelsAi", "llama-2-7b-chat.Q4_K_M.gguf");
            _modelParams = new ModelParams(_modelPath)
            {
                ContextSize = 1024,
                GpuLayerCount = 5, // отрегулируй по своей видеокарте, если есть GPU
            };
        }

        public async Task InitializeAsync()
        {
            if (!File.Exists(_modelPath))
                throw new FileNotFoundException("Файл модели не найден", _modelPath);

            _model = LLamaWeights.LoadFromFile(_modelParams);
            _context = _model.CreateContext(_modelParams);
            _executor = new InteractiveExecutor(_context);

            await Task.CompletedTask;
        }

        public async Task<string> GenerateTextAsync(string prompt)
        {
            if (_executor == null)
                throw new InvalidOperationException("Модель не инициализирована. Вызовите InitializeAsync.");

            // Ожидаем доступа к исполнителю (только один вызов одновременно)
            await _semaphore.WaitAsync();

            try
            {
                var chatHistory = new ChatHistory();
                chatHistory.AddMessage(AuthorRole.System, "Ты — умный помощник, помогаешь пользователю");
                // chatHistory.AddMessage(AuthorRole.User, prompt);

                var session = new ChatSession(_executor, chatHistory);

                var inferenceParams = new InferenceParams()
                {
                    MaxTokens = 256,
                    AntiPrompts = new List<string> { "User:" },
                    SamplingPipeline = new DefaultSamplingPipeline(),
                };

                string result = "";
                await foreach (var text in session.ChatAsync(new ChatHistory.Message(AuthorRole.User, prompt), inferenceParams))
                {
                    result += text;
                }

                return result;
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public void Dispose()
        {
            _context?.Dispose();
            _model?.Dispose();
            _semaphore.Dispose();
        }
    }
}
