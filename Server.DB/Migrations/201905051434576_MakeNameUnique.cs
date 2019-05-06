namespace Server.DB.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeNameUnique : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "Name", c => c.String(nullable: false, maxLength: 50));
            AlterColumn("dbo.Categories", "Name", c => c.String(nullable: false, maxLength: 50));
            CreateIndex("dbo.Categories", "Name", unique: true);
            CreateIndex("dbo.Products", "Name", unique: true);
            DropColumn("dbo.Products", "ProductName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Products", "ProductName", c => c.String(nullable: false, maxLength: 50));
            DropIndex("dbo.Products", new[] { "Name" });
            DropIndex("dbo.Categories", new[] { "Name" });
            AlterColumn("dbo.Categories", "Name", c => c.String(nullable: false));
            DropColumn("dbo.Products", "Name");
        }
    }
}
