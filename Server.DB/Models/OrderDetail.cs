using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DB.Models
{
    public class OrderDetail
    {
        public int? OrderDetailId { get; set; }

        public virtual Product Product { get; set; }

        public int Quantity { get; set; }

        public float? UnitPrice { get; set; }
    }
}
