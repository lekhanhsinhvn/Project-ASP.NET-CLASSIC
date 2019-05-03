using Server.DB.Models;
using System.Data.Entity;

namespace Server.DB
{
    public class ServerContext : DbContext
    {
        public ServerContext() : base("name=connstring")
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
