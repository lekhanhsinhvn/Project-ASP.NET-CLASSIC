using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DB.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        [MaxLength(50)]
        public string ProductName { get; set; }
        [Required]

        public int Price { get; set; }
        [Required]
        [Column(TypeName = "varchar(MAX)")]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "varchar(MAX)")]
        public string Image { get; set; }
        [Required]

        public int CategoryId { get; set; }

        public DateTime CreatedUpdate { get; set; }

        public DateTime ModifiedUpdate { get; set; }

        public int Quantity { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
    }
}
