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
                    new Product() { ProductId = 1, Name = "Giấy A0", Price = 200000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "GI-A0.jpg" },
                    new Product() { ProductId = 2, Name = "Giấy A1", Price = 150000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "giay-a1.jpg" },
                    new Product() { ProductId = 3, Name = "Giấy A2", Price = 100000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "giay-a2.jpg" },
                    new Product() { ProductId = 4, Name = "Giấy A3", Price = 80000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "giay-a3.jpg" },
                    new Product() { ProductId = 5, Name = "Giấy A4", Price = 60000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "giay-a4.jpg" },
                    new Product() { ProductId = 6, Name = "Giấy nhớ", Price = 40000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "giay-nho.jpg" },
                    new Product() { ProductId = 7, Name = "Bìa lỗ", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "bia-lo-a4.jpg" },
                    new Product() { ProductId = 8, Name = "Cặp 3 dây", Price = 10000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "cap-3-day.jpg" },
                    new Product() { ProductId = 9, Name = "Bìa còng", Price = 20000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "bia-cong.jpg" },
                    new Product() { ProductId = 10, Name = "Bìa hộp", Price = 18000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "bia-hop.jpg" },
                    new Product() { ProductId = 11, Name = "Cặp trình ký", Price = 14000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "cap-trinh-ky.jpg" },
                    new Product() { ProductId = 12, Name = "Băng dính", Price = 14000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "bang-dinh.jpg" },
                    new Product() { ProductId = 13, Name = "Vở ô ly", Price = 10000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "vo-o-ly.png" },
                    new Product() { ProductId = 14, Name = "Vở kẻ ngang", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "vo-ke-ngang.jpg" },
                    new Product() { ProductId = 15, Name = "Sổ tay", Price = 25000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "so-tay.jpg" },
                    new Product() { ProductId = 16, Name = "Sổ bìa da", Price = 30000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "so-bia-da.jpg" },
                    new Product() { ProductId = 17, Name = "Phong bì", Price = 1000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "phong-bi.jpg" },
                    new Product() { ProductId = 18, Name = "Bút chì kim bấm", Price = 1000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-chi-kim-bam.jpg" },
                    new Product() { ProductId = 19, Name = "Bút chì khúc", Price = 3000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but_chi_khuc.jpg" },
                    new Product() { ProductId = 20, Name = "Bút bi xanh", Price = 3000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-bi-xanh.jpg" },
                    new Product() { ProductId = 21, Name = "Bút bi đen", Price = 3000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-bi-den.jpg" },
                    new Product() { ProductId = 22, Name = "Bút viết bảng", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-viet-bang.jpg" },
                    new Product() { ProductId = 23, Name = "Bút xóa", Price = 12000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-xoa.jpg" },
                    new Product() { ProductId = 24, Name = "Thước kẻ", Price = 5000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "thuoc-ke.jpg" },
                    new Product() { ProductId = 25, Name = "Compa", Price = 8000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "compa.jpg" },
                    new Product() { ProductId = 26, Name = "Mực viết bảng", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "muc-viet-bang.jpg" },
                    new Product() { ProductId = 27, Name = "Mực viết bút máy", Price = 20000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "muc-viet-but.jpg" },
                    new Product() { ProductId = 28, Name = "Bút máy", Price = 15000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "but-may.jpg" },
                    new Product() { ProductId = 29, Name = "Ba lô", Price = 100000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "ba-lo.jpg" },
                    new Product() { ProductId = 30, Name = "Cặp sách", Price = 80000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "cap-sach.jpg" },
                    new Product() { ProductId = 31, Name = "Kim bấp", Price = 2000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "kim-bam.jpg" },
                    new Product() { ProductId = 32, Name = "Kẹp bướm", Price = 2000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "kep-buom.jpg" },
                    new Product() { ProductId = 33, Name = "Ruột bút chì bấm", Price = 5000, Quantity = 100, CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now, Image = "ruot-but-chi-bam.jpg" }


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
