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

        {   // User
            descriptor.Field(t => t.GetUser(default, default))
                .Type<UserType>().Name("GetUser");
            descriptor.Field(t => t.GetUsers(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetUsers")
                                            .Use((services, next) => new AuthMiddleware(next, new string[] { "Employee", "Admin" }));

            // Role
            descriptor.Field(t => t.GetRole(default, default))
                .Type<UserType>().Name("GetRole");
            descriptor.Field(t => t.GetRoles(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetRoles");

            // Product
            descriptor.Field(t => t.GetProduct(default, default))
                .Type<UserType>().Name("GetProduct");
            descriptor.Field(t => t.GetProducts(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetProducts");

            // Category
            descriptor.Field(t => t.GetCategory(default, default))
                .Type<UserType>().Name("GetCategory");
            descriptor.Field(t => t.GetCategories(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetCategories");

            // Order
            descriptor.Field(t => t.GetOrder(default, default))
                .Type<UserType>().Name("GetOrder");
            descriptor.Field(t => t.GetOrders(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("GetOrders");
        }
    }
}