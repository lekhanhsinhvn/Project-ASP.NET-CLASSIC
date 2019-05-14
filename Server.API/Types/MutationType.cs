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
            // Auth
            descriptor.Field(t => t.Login(default, default, default))
                .Type<StringType>().Name("login");
            descriptor.Field(t => t.Logout(default))
                .Type<StringType>().Name("logout");

            // User
            descriptor.Field(t => t.CreateUser(default, default))
                .Type<UserType>().Name("createUser");
            descriptor.Field(t => t.DeleteUser(default, default))
                .Type<UserType>().Name("deleteUser").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateUser(default, default, default))
                .Type<UserType>().Name("updateUser");
            descriptor.Field(t => t.UpdateSelf(default, default, default, default))
                .Type<UserType>().Name("updateSelf");

            // Role
            descriptor.Field(t => t.CreateRole(default, default))
                .Type<RoleType>().Name("createRole").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateRole(default, default))
                .Type<RoleType>().Name("updateRole").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.DeleteRole(default, default))
                .Type<RoleType>().Name("deleteRole").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));

            // Product
            descriptor.Field(t => t.CreateProduct(default, default))
                .Type<ProductType>().Name("createProduct").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateProduct(default, default, default))
                .Type<ProductType>().Name("updateProduct").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.DeleteProduct(default, default))
                .Type<ProductType>().Name("deleteProduct").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));

            // Category
            descriptor.Field(t => t.CreateCategory(default, default))
                .Type<CategoryType>().Name("createCategory").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateCategory(default, default))
                .Type<CategoryType>().Name("updateCategory").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.DeleteCategory(default, default))
                .Type<CategoryType>().Name("deleteCategory").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));

            // Order
            descriptor.Field(t => t.CreateOrder(default, default, default, default))
                .Type<OrderType>().Name("createOrder").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.UpdateOrder(default, default))
                .Type<OrderType>().Name("updateOrder").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
            descriptor.Field(t => t.DeleteOrder(default, default))
                .Type<OrderType>().Name("deleteOrder").Use((services, next) => new AuthMiddleware(next, new string[] { "Admin" }));
        }
    }
}