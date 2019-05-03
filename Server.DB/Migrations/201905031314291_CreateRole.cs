namespace Server.DB.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateRole : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Products", "CategoryId", "dbo.Categories");
            DropIndex("dbo.Products", new[] { "CategoryId" });
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        RoleId = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        User_UserId = c.Int(),
                    })
                .PrimaryKey(t => t.RoleId)
                .ForeignKey("dbo.Users", t => t.User_UserId)
                .Index(t => t.User_UserId);
            
            CreateTable(
                "dbo.ProductCategories",
                c => new
                    {
                        Product_ProductId = c.Int(nullable: false),
                        Category_CategoryId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Product_ProductId, t.Category_CategoryId })
                .ForeignKey("dbo.Products", t => t.Product_ProductId, cascadeDelete: true)
                .ForeignKey("dbo.Categories", t => t.Category_CategoryId, cascadeDelete: true)
                .Index(t => t.Product_ProductId)
                .Index(t => t.Category_CategoryId);
            
            DropColumn("dbo.Users", "Role");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Role", c => c.String());
            DropForeignKey("dbo.Roles", "User_UserId", "dbo.Users");
            DropForeignKey("dbo.ProductCategories", "Category_CategoryId", "dbo.Categories");
            DropForeignKey("dbo.ProductCategories", "Product_ProductId", "dbo.Products");
            DropIndex("dbo.ProductCategories", new[] { "Category_CategoryId" });
            DropIndex("dbo.ProductCategories", new[] { "Product_ProductId" });
            DropIndex("dbo.Roles", new[] { "User_UserId" });
            DropTable("dbo.ProductCategories");
            DropTable("dbo.Roles");
            CreateIndex("dbo.Products", "CategoryId");
            AddForeignKey("dbo.Products", "CategoryId", "dbo.Categories", "CategoryId", cascadeDelete: true);
        }
    }
}
