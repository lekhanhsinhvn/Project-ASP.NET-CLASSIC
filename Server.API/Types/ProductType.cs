using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class ProductType: ObjectType<Product>
    {
        protected override void Configure(IObjectTypeDescriptor<Product> descriptor)
        {
            descriptor.Field(t => t.ProductId).Type<IntType>();
            descriptor.Field(t => t.Name).Type<StringType>();
            descriptor.Field(t => t.Description).Type<StringType>();
            descriptor.Field(t => t.Image).Type<StringType>();
            descriptor.Field(t => t.Categories).Type<ListType<CategoryType>>();
            descriptor.Field(t => t.Price).Type<FloatType>();
            descriptor.Field(t => t.Quantity).Type<IntType>();
            descriptor.Field(t => t.CreatedDate).Type<DateType>();
            descriptor.Field(t => t.ModifiedDate).Type<DateType>();
        }
    }
}