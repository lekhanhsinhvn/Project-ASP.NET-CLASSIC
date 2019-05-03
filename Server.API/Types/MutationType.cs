using HotChocolate.Types;
using Server.API.GraphQLSchema;
using Server.API.Middlewares;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.Types
{
    public class MutationType: ObjectType<Mutation>
    {
        protected override void Configure(IObjectTypeDescriptor<Mutation> descriptor)
        {
            descriptor.Field(t => t.Login(default, default, default))
                .Type<StringType>();
            descriptor.Field(t => t.Logout(default))
                .Type<StringType>();
            descriptor.Field(t => t.CreateUser(default, default))
                .Type<UserType>();
            descriptor.Field(t => t.DeleteUser(default, default))
                .Type<UserType>().Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateSelf(default, default, default))
                .Type<UserType>();
            descriptor.Field(t => t.UpdateUser(default, default))
                .Type<UserType>().Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
        }
    }
}