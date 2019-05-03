using HotChocolate.Types;
using HotChocolate.AspNetClassic;
using Server.API.GraphQLSchema;
using Server.API.Middlewares;
using HotChocolate.AspNetClassic.Authorization;

namespace Server.API.Types
{
    public class QueryType : ObjectType<Query>
    {
        protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
        {
            descriptor.Field(t => t.GetUser(default, default))
                .Type<UserType>().Name("GetUser");
            descriptor.Field(t => t.GetUsers(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetUsers")
                                            .Use((services, next) => new AuthMiddleware(next, new string[] { "Employee", "Admin" }));
        }
    }
}