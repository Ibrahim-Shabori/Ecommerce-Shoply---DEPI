using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace ShoplyStore.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;

        [Required]
        public string ISBN { get; set; } = string.Empty;
        [Required]
        public string Author { get; set; } = string.Empty;
        [Required]
        [DisplayName("List Price")]
        [Range(1, 10000, ErrorMessage = "Price must be between 1 and 10000")]
        public double ListPrice { get; set; }

        [Required]
        [DisplayName("Price for 1-50")]
        [Range(1, 10000, ErrorMessage = "Price must be between 1 and 10000")]
        public double Price { get; set; }

        [Required]
        [DisplayName("Price for 50+")]
        [Range(1, 10000, ErrorMessage = "Price must be between 1 and 10000")]
        public double Price50 { get; set; }

        [Required]
        [DisplayName("Price for 100+")]
        [Range(1, 10000, ErrorMessage = "Price must be between 1 and 10000")]
        public double Price100 { get; set; }

        [Required]
        
        public int CategoryId { get; set; }


        [ForeignKey("CategoryId")]
        [ValidateNever]
        public Category? Category { get; set; } = null!;
        [DisplayName("Image URL")]
        [ValidateNever]
        public string? ImageUrl { get; set; } = string.Empty;

        bool? IsNew { get; set; } = false;

    }
}
