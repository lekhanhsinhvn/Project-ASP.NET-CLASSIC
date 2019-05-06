﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Server.DB.Models;

namespace Server.DB
{
    public class DbInitalize : DropCreateDatabaseIfModelChanges<ServerContext>
    {
        protected override void Seed(ServerContext context)
        {
            List<Category> categories = new List<Category>()
            {
                new Category() { CategoryId = 1, Name = "Giấy in" , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now, Description = "Giấy in photo các khổ từ A0 đến A5, Giấy ghi chú bìa màu..."},
                new Category() { CategoryId = 2, Name = "File hồ sơ" , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now, Description = "Bìa Kiếng, Bìa còng, Bìa hộp, Bìa nhựa, Bìa lỗ ..."},
                new Category() { CategoryId = 3, Name = "Sổ - Tập" , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now, Description = "Sổ các loại , Tập vở , Bao thư..."},
                new Category() { CategoryId = 4, Name = "Dụng cụ học tập" , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now, Description = "Bút bi, bút gel, bút lông, Bút xóa , bút chì, thước kẻ, compa..."},
                new Category() { CategoryId = 5, Name = "Khác" , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now, Description = "Cặp sách , Ba lô, Kim bấm , Kẹp bướm..."}
            };
            context.Categories.AddRange(categories);



            List<Product> products = new List<Product>()
            {
                new Product() {ProductId =  1, Name = "Giấy A0", Price = 200000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  2, Name = "Giấy A1", Price = 150000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  3, Name = "Giấy A2", Price = 100000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  4, Name = "Giấy A3", Price = 80000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  5, Name = "Giấy A4", Price = 60000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  6, Name = "Giấy A5", Price = 40000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  7, Name = "Bìa lỗ", Price = 15000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  8, Name = "Bìa Kiếng", Price = 10000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  9, Name = "Bìa còng", Price = 20000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  10, Name = "Bìa hộp", Price = 18000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  11, Name = "Bìa nhựa", Price = 14000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now },
                new Product() {ProductId =  12, Name = "Bìa hộp", Price = 30000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  13, Name = "Vở ô ly", Price = 10000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  14, Name = "Vở thếp", Price = 15000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  15, Name = "Sổ tay", Price = 25000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  16, Name = "Sổ nhật ký", Price = 30000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  17, Name = "Phong bì", Price = 1000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  18, Name = "Bao thư", Price = 1000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  19, Name = "Bút bi", Price = 3000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  20, Name = "Bút chì", Price = 2000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  21, Name = "Bút lông", Price = 10000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  22, Name = "Bút Gel", Price = 15000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  23, Name = "Bút xóa", Price = 12000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  24, Name = "Thước kẻ", Price = 5000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  25, Name = "Compa", Price = 8000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  26, Name = "Mực viết bảng", Price = 15000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  27, Name = "Mực viết bút máy", Price = 20000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  28, Name = "Bút máy", Price = 15000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  29, Name = "Ba lô", Price = 100000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  30, Name = "Cặp sách", Price = 80000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  31, Name = "Kim bấp", Price = 2000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Product() {ProductId =  32, Name = "Kẹp bướm", Price = 2000, Quantity = 100 , CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now}



            };
            context.Products.AddRange(products);



            List<Role> roles = new List<Role>()
            {
                new Role() { RoleId = 1, Name = "Admin", Level = 0, Description = "Admin", CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Role() { RoleId = 2, Name = "Employee", Level = 1, Description = "Employee", CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now},
                new Role() { RoleId = 3, Name = "User", Level = 1000, Description = "User", CreatedDate = DateTime.Now, ModifiedDate=DateTime.Now}
            };
            context.Roles.AddRange(roles);

            context.SaveChanges();
            base.Seed(context);
        }
    }
}