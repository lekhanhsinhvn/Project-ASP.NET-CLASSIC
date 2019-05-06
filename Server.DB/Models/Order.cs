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
        public int? OrderId { get; set; }
        
        public int? TotalCount { get; set; }

        public float? TotalPrice { get; set; }

        public string Status { get; set; }

        public virtual User Superior { get; set; }

        public virtual User Inferior { get; set; }

        public virtual ICollection<Product> Products { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
