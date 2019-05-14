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
                    new Role() { RoleId = 1, Name = "Admin", Level = 0, Description = "Admin", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now },
                    new Role() { RoleId = 2, Name = "Employee", Level = 1, Description = "Employee", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now },
                    new Role() { RoleId = 3, Name = "User", Level = 1000, Description = "User", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now }
                    );

            context.Products.AddOrUpdate(x => x.ProductId,
                    new Product() { ProductId = 1, Name = "Giấy A0", Price = 200000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image="default.png" },
                    new Product() { ProductId = 2, Name = "Giấy A1", Price = 150000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 3, Name = "Giấy A2", Price = 100000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 4, Name = "Giấy A3", Price = 80000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 5, Name = "Giấy A4", Price = 60000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 6, Name = "Giấy A5", Price = 40000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 7, Name = "Bìa lỗ", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 8, Name = "Bìa Kiếng", Price = 10000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 9, Name = "Bìa còng", Price = 20000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 10, Name = "Bìa hộp", Price = 18000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 11, Name = "Bìa nhựa", Price = 14000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 13, Name = "Vở ô ly", Price = 10000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 14, Name = "Vở thếp", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 15, Name = "Sổ tay", Price = 25000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 16, Name = "Sổ nhật ký", Price = 30000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 17, Name = "Phong bì", Price = 1000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 18, Name = "Bao thư", Price = 1000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 19, Name = "Bút bi", Price = 3000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 20, Name = "Bút chì", Price = 2000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 21, Name = "Bút lông", Price = 10000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 22, Name = "Bút Gel", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 23, Name = "Bút xóa", Price = 12000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 24, Name = "Thước kẻ", Price = 5000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 25, Name = "Compa", Price = 8000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 26, Name = "Mực viết bảng", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 27, Name = "Mực viết bút máy", Price = 20000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 28, Name = "Bút máy", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 29, Name = "Ba lô", Price = 100000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 30, Name = "Cặp sách", Price = 80000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 31, Name = "Kim bấp", Price = 2000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" },
                    new Product() { ProductId = 32, Name = "Kẹp bướm", Price = 2000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "default.png" }
                    );
            context.Categories.AddOrUpdate(x => x.CategoryId,
                    new Category() { CategoryId = 1, Name = "Giấy in", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Description = "Giấy in photo các khổ từ A0 đến A5, Giấy ghi chú bìa màu..." },
                    new Category() { CategoryId = 2, Name = "File hồ sơ", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Description = "Bìa Kiếng, Bìa còng, Bìa hộp, Bìa nhựa, Bìa lỗ ..." },
                    new Category() { CategoryId = 3, Name = "Sổ - Tập", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Description = "Sổ các loại , Tập vở , Bao thư..." },
                    new Category() { CategoryId = 4, Name = "Dụng cụ học tập", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Description = "Bút bi, bút gel, bút lông, Bút xóa , bút chì, thước kẻ, compa..." },
                    new Category() { CategoryId = 5, Name = "Khác", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Description = "Cặp sách , Ba lô, Kim bấm , Kẹp bướm..." }
                );
        }
    }
}
