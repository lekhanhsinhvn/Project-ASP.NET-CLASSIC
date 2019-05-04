using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.DB.Models
{
    public class User
    {
        [Key]
        public int? UserId { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "Name cannot be less than 5")]
        [MaxLength(15, ErrorMessage = "Name cannot be less than 15")]
        public string Name { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string Avatar { get; set; } = "default.png";

        [Required]
        [EmailAddress(ErrorMessage = "Email is not valid")]
        [StringLength(25)]
        [Index(IsUnique = true)]
        public string Email { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "Password cannot be less than 5")]
        [Column(TypeName = "varchar(MAX)")]
        public string Password { get; set; }

        public virtual ICollection<Role> Roles { get; set; } 

        [Range(0, 1000, ErrorMessage = "SuperiorId must be from 1 to 1000")]
        public int? SuperiorId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        [InverseProperty("Inferior")]
        public virtual ICollection<Order>  InferiorOrders { get; set; }

        [InverseProperty("Superior")]
        public virtual ICollection<Order> SuperiorOrders { get; set; }

    }
}
