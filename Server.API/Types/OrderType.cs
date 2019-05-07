using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class OrderType : ObjectType<Order>
    {
        protected override void Configure(IObjectTypeDescriptor<Order> descriptor)
        {
            descriptor.Field(t => t.OrderId).Type<IntType>();
            descriptor.Field(t => t.OrderDetails).Type<ListType<OrderDetailType>>();
            descriptor.Field(t => t.TotalCount).Type<IntType>();
            descriptor.Field(t => t.TotalPrice).Type<FloatType>();
            descriptor.Field(t => t.Status).Type<StringType>();
            descriptor.Field(t => t.Inferior).Type<UserType>();
            descriptor.Field(t => t.Superior).Type<UserType>();
            descriptor.Field(t => t.CreatedDate).Type<DateType>();
            descriptor.Field(t => t.ModifiedDate).Type<DateType>();
        }
    }
}