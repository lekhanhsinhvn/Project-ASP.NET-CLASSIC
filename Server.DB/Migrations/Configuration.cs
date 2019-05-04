namespace Server.DB.Migrations
{
    using Server.DB.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Server.DB.ServerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Server.DB.ServerContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
            context.Roles.AddOrUpdate(x => x.RoleId,
                    new Role() { RoleId = 1, Name = "Admin", Description = "", Level = 0, CreatedDate=DateTime.Now, ModifiedDate=DateTime.Now},
                    new Role() { RoleId = 2, Name = "User", Description = "", Level = 1000, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now }
                    );
        }
    }
}
