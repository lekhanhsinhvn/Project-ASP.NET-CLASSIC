using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DB.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public DateTime CreatedUpdate { get; set; }

        public DateTime ModifiedUpdate { get; set; }
        [Required]
        public int Quantity { get; set; }
        
        public int TotalCount { get; set; }

        public float TotalPrice { get; set; }


        public virtual User Superior { get; set; }

        public virtual User Inferior { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
