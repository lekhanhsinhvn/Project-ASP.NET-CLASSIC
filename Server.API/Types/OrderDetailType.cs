using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class OrderDetailType : ObjectType<OrderDetail>
    {
        protected override void Configure(IObjectTypeDescriptor<OrderDetail> descriptor)
        {
            descriptor.Field(t => t.OrderDetailId).Type<IntType>();
            descriptor.Field(t => t.Product).Type<ProductType>();
            descriptor.Field(t => t.Quantity).Type<IntType>();
            descriptor.Field(t => t.UnitPrice).Type<FloatType>();
        }
    }
}