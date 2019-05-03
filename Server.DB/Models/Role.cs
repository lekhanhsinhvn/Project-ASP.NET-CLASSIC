using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.DB.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        public string Name { get; set; }


    }
}
