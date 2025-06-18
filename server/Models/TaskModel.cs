using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class TaskModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? Deadline { get; set; }
        public string Status { get; set; } = "not_started";
        public string Priority { get; set; } = "medium";
        public int TopicId { get; set; }

        [ForeignKey("TopicId")]
        public TopicModel Topic { get; set; }
    }
}
