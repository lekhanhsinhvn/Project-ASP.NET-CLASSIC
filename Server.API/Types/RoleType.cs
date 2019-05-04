using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class RoleType : ObjectType<Role>
    {
        protected override void Configure(IObjectTypeDescriptor<Role> descriptor)
        {
            descriptor.Field(t => t.RoleId).Type<IntType>();
            descriptor.Field(t => t.Name).Type<StringType>();
            descriptor.Field(t => t.Description).Type<StringType>();
            descriptor.Field(t => t.Level).Type<IntType>();
            descriptor.Field(t => t.CreatedDate).Type<DateType>();
            descriptor.Field(t => t.ModifiedDate).Type<DateType>();
        }
    }
}