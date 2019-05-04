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
        public int? RoleId { get; set; }

        [Required]
        [StringLength(25)]
        [Index(IsUnique = true)]
        public string Name { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string Description { get; set; }

        [Required]
        public int? Level { get; set; }

        public virtual ICollection<User> Users { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }
}
