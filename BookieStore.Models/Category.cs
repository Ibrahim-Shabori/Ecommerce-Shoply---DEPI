using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ShoplyStore.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]

        [DisplayName("Category Name")]
        [MaxLength(30)]
        public string Name { get; set; } = string.Empty;

        [DisplayName("Description")]
        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;

        List<Product>? Products { get; set; } = new List<Product>();
    }
}
