namespace Server.DB.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class VarchartoNvarchar : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Categories", "Description", c => c.String());
            AlterColumn("dbo.Products", "Description", c => c.String());
            AlterColumn("dbo.Products", "Image", c => c.String());
            AlterColumn("dbo.Users", "Avatar", c => c.String());
            AlterColumn("dbo.Users", "Password", c => c.String(nullable: false));
            AlterColumn("dbo.Roles", "Description", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Roles", "Description", c => c.String(unicode: false));
            AlterColumn("dbo.Users", "Password", c => c.String(nullable: false, unicode: false));
            AlterColumn("dbo.Users", "Avatar", c => c.String(unicode: false));
            AlterColumn("dbo.Products", "Image", c => c.String(unicode: false));
            AlterColumn("dbo.Products", "Description", c => c.String(unicode: false));
            AlterColumn("dbo.Categories", "Description", c => c.String(unicode: false));
        }
    }
}
