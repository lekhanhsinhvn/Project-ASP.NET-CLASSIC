﻿using System;
using HotChocolate;
using HotChocolate.AspNetClassic;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Owin;
using Owin;
using Server.API.Types;
using Server.DB;
using Server.API.Repositories;
using HotChocolate.Execution.Configuration;
using Server.API.GraphQLSchema;
using Client;

[assembly: OwinStartup(typeof(Server.API.Startup))]

namespace Server.API
{
    public class Startup
    {
        public IServiceProvider ConfigureServices()
        {
            var services = new ServiceCollection();

            services.AddScoped<ServerContext>();

            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddSingleton<IAuthRepository, AuthRepository>();
            services.AddSingleton<IRoleRepository, RoleRepository>();
            services.AddSingleton<IProductRepository, ProductRepository>();
            services.AddSingleton<ICategoryRepository, CategoryRepository>();
            services.AddSingleton<IOrderRepository, OrderRepository>();
            services.AddSingleton<IFileHandler, FileHandler>();

            services.AddSingleton<Query>();
            services.AddSingleton<Mutation>();

            var schema = Schema.Create(c =>
            {
                c.RegisterServiceProvider(services.BuildServiceProvider());
                // Adds the authorize directive and
                // enable the authorization middleware.
                c.RegisterAuthorizeDirectiveType();

                c.RegisterQueryType<QueryType>();
                c.RegisterMutationType<MutationType>();

                c.RegisterType<UserType>();
                c.RegisterType<RoleType>();
                c.RegisterType<ProductType>();
                c.RegisterType<CategoryType>();
                c.RegisterType<OrderType>();
                c.RegisterType<OrderDetailType>();

            }).MakeExecutable(new QueryExecutionOptions { IncludeExceptionDetails = true });
            services.AddGraphQL(schema);
            return services.BuildServiceProvider();
        }
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            IServiceProvider services = ConfigureServices();
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseGraphQL(services, new PathString("/graphql"))
               .UsePlayground(new PathString("/graphql"), new PathString("/graphql"));
        }
    }
}
