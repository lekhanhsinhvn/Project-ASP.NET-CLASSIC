namespace Server.DB.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateProductOrderCategory : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        CategoryId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.CategoryId);
            
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        ProductId = c.Int(nullable: false, identity: true),
                        ProductName = c.String(nullable: false, maxLength: 50),
                        Price = c.Int(nullable: false),
                        Description = c.String(nullable: false, unicode: false),
                        Image = c.String(nullable: false, unicode: false),
                        CategoryId = c.Int(nullable: false),
                        CreatedUpdate = c.DateTime(nullable: false),
                        ModifiedUpdate = c.DateTime(nullable: false),
                        Quantity = c.Int(nullable: false),
                        Order_OrderId = c.Int(),
                    })
                .PrimaryKey(t => t.ProductId)
                .ForeignKey("dbo.Categories", t => t.CategoryId, cascadeDelete: true)
                .ForeignKey("dbo.Orders", t => t.Order_OrderId)
                .Index(t => t.CategoryId)
                .Index(t => t.Order_OrderId);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        OrderId = c.Int(nullable: false, identity: true),
                        CreatedUpdate = c.DateTime(nullable: false),
                        ModifiedUpdate = c.DateTime(nullable: false),
                        Quantity = c.Int(nullable: false),
                        TotalCount = c.Int(nullable: false),
                        TotalPrice = c.Single(nullable: false),
                        Inferior_UserId = c.Int(),
                        Superior_UserId = c.Int(),
                    })
                .PrimaryKey(t => t.OrderId)
                .ForeignKey("dbo.Users", t => t.Inferior_UserId)
                .ForeignKey("dbo.Users", t => t.Superior_UserId)
                .Index(t => t.Inferior_UserId)
                .Index(t => t.Superior_UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Products", "Order_OrderId", "dbo.Orders");
            DropForeignKey("dbo.Orders", "Superior_UserId", "dbo.Users");
            DropForeignKey("dbo.Orders", "Inferior_UserId", "dbo.Users");
            DropForeignKey("dbo.Products", "CategoryId", "dbo.Categories");
            DropIndex("dbo.Orders", new[] { "Superior_UserId" });
            DropIndex("dbo.Orders", new[] { "Inferior_UserId" });
            DropIndex("dbo.Products", new[] { "Order_OrderId" });
            DropIndex("dbo.Products", new[] { "CategoryId" });
            DropTable("dbo.Orders");
            DropTable("dbo.Products");
            DropTable("dbo.Categories");
        }
    }
}
