using HotChocolate.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class UserType : ObjectType<User>
    {
        protected override void Configure(IObjectTypeDescriptor<User> descriptor)
        {
            descriptor.Field(t => t.UserId).Type<IntType>();
            descriptor.Field(t => t.Name).Type<StringType>();
            descriptor.Field(t => t.Email).Type<StringType>();
            descriptor.Field(t => t.Avatar).Type<StringType>();
            descriptor.Field(t => t.Password).Type<StringType>();
            //descriptor.Field(t => t.Role).Type<StringType>();
            descriptor.Field(t => t.SuperiorId).Type<IntType>();
        }
    }
}