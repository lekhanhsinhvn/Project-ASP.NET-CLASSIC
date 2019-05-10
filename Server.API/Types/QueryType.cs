﻿using HotChocolate.Types;
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
            descriptor.Field(t => t.GetUsers(default, default, default, default, default, default))
                .Type<ListType<UserType>>().Name("getUsers")
                                            .Use((services, next) => new AuthMiddleware(next, new string[] { "Employee", "Admin" }));

            // Role
            descriptor.Field(t => t.GetRole(default, default))
                .Type<RoleType>().Name("getRole");
            descriptor.Field(t => t.GetRoles(default, default, default, default, default, default))
                .Type<ListType<RoleType>>().Name("getRoles");

            // Product
            descriptor.Field(t => t.GetProduct(default, default))
                .Type<ProductType>().Name("getProduct");
            descriptor.Field(t => t.GetProducts(default, default, default, default, default, default))
                .Type<ListType<ProductType>>().Name("getProducts");

            // Category
            descriptor.Field(t => t.GetCategory(default, default))
                .Type<CategoryType>().Name("getCategory");
            descriptor.Field(t => t.GetCategories(default, default, default, default, default, default))
                .Type<ListType<CategoryType>>().Name("getCategories");

            // Order
            descriptor.Field(t => t.GetOrder(default, default))
                .Type<OrderType>().Name("getOrder");
            descriptor.Field(t => t.GetOrders(default, default, default, default, default, default))
                .Type<ListType<OrderType>>().Name("getOrders");
        }
    }
}