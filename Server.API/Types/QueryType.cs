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
                .Type<UserType>().Name("getUser");
            descriptor.Field(t => t.GetSelf(default))
                .Type<UserType>().Name("getSelf");
            descriptor.Field(t => t.GetSuperior(default))
                .Type<UserType>().Name("getSuperior");
            descriptor.Field(t => t.GetUsers(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("getUsers");
            descriptor.Field(t => t.GetTotalCountUser(default))
                .Type<IntType>().Name("getTotalCountUser");

            // Role
            descriptor.Field(t => t.GetRole(default, default))
                .Type<RoleType>().Name("getRole");
            descriptor.Field(t => t.GetRoles(default, default, default, default, default, default))
                .Type<ListType<RoleType>>().Name("getRoles");
            descriptor.Field(t => t.GetTotalCountRole(default))
                .Type<IntType>().Name("getTotalCountRole");

            // Product
            descriptor.Field(t => t.GetProduct(default, default))
                .Type<ProductType>().Name("getProduct");
            descriptor.Field(t => t.GetProducts(default, default, default, default, default, default))
                .Type<ListType<ProductType>>().Name("getProducts");
            descriptor.Field(t => t.GetTotalCountProduct(default))
                .Type<IntType>().Name("getTotalCountProduct");

            // Category
            descriptor.Field(t => t.GetCategory(default, default))
                .Type<CategoryType>().Name("getCategory");
            descriptor.Field(t => t.GetCategories(default, default, default, default, default, default))
                .Type<ListType<CategoryType>>().Name("getCategories");
            descriptor.Field(t => t.GetTotalCountCategory(default))
                .Type<IntType>().Name("getTotalCountCategory");

            // Order
            descriptor.Field(t => t.GetOrder(default, default))
                .Type<OrderType>().Name("getOrder");
            descriptor.Field(t => t.GetOrders(default, default, default, default, default, default))
                .Type<ListType<OrderType>>().Name("getOrders");
            descriptor.Field(t => t.GetTotalCountOrder(default))
                .Type<IntType>().Name("getTotalCountOrder");
        }
    }
}