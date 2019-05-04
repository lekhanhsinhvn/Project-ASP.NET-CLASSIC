using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class CategoryType : ObjectType<Category>
    {
        protected override void Configure(IObjectTypeDescriptor<Category> descriptor)
        {
            descriptor.Field(t => t.CategoryId).Type<IntType>();
            descriptor.Field(t => t.Name).Type<StringType>();
            descriptor.Field(t => t.Description).Type<StringType>();
            descriptor.Field(t => t.Products).Type<ListType<ProductType>>();
            descriptor.Field(t => t.CreatedDate).Type<DateType>();
            descriptor.Field(t => t.ModifiedDate).Type<DateType>();
        }
    }
}