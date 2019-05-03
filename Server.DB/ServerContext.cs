﻿using Server.DB.Models;
using System.Data.Entity;

namespace Server.DB
{
    public class ServerContext : DbContext
    {
        public ServerContext() : base("name=connstring")
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}
