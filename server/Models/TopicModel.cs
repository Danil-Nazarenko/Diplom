using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class TopicModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }
        public string UserId { get; set; }
    }
}
