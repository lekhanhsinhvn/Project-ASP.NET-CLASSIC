using Client;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Resolvers;
using Server.API.Repositories;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace Server.API.GraphQLSchema
{
    public class Mutation
    {
        private readonly IAuthRepository _authRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IOrderRepository _orderRepository;

        public Mutation(IAuthRepository authRepository, IUserRepository userRepository, IRoleRepository roleRepository, IProductRepository productRepository, ICategoryRepository categoryRepository, IOrderRepository orderRepository)
        {
            _authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }

        public string Login(string email, string password, IResolverContext context)
        {
            try
            {
                string token = _authRepository.Login(email, password, context.RequestAborted).Result;
                HttpCookie UserCookie = new HttpCookie("UserCookie", token)
                {
                    Expires = DateTime.Now.AddHours(24),
                    SameSite = SameSiteMode.Strict,
                    Domain = HttpContext.Current.Request.Url.Host,
                    HttpOnly=true,
                };

                HttpContext.Current.Response.Cookies.Add(UserCookie);

            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return "LOG_IN";
        }

        public string Logout(IResolverContext context)
        {
            HttpContext.Current.Response.Cookies["UserCookie"].Value = "";
            HttpContext.Current.Response.Cookies["UserCookie"].Expires = DateTime.Now.AddDays(-1);
            return "LOG_OUT";
        }

        public User CreateUser(User user, IResolverContext context)
        {
            try
            {
                return _userRepository.CreateUser(user, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public User DeleteUser(int userId, IResolverContext context)
        {
            try
            {
                return _userRepository.DeleteUser(userId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public User UpdateSelf(User user, string base64String, string newPassword, IResolverContext context)
        {
            try
            {
                return _userRepository.UpdateSelf(user, base64String, newPassword, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public User UpdateUser(User user, string base64String, IResolverContext context)
        {
            try
            {
                return _userRepository.UpdateUser(user, base64String, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Role CreateRole(Role role, IResolverContext context)
        {
            try
            {
                return _roleRepository.CreateRole(role, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Role UpdateRole(Role role, IResolverContext context)
        {
            try
            {
                return _roleRepository.UpdateRole(role, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Role DeleteRole(int roleId, IResolverContext context)
        {
            try
            {
                return _roleRepository.DeleteRole(roleId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Product CreateProduct(Product product, IResolverContext context)
        {
            try
            {
                return _productRepository.CreateProduct(product, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Product UpdateProduct(Product product, IResolverContext context)
        {
            try
            {
                return _productRepository.UpdateProduct(product, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Product DeleteProduct(int productId, IResolverContext context)
        {
            try
            {
                return _productRepository.DeleteProduct(productId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Category CreateCategory(Category category, IResolverContext context)
        {
            try
            {
                return _categoryRepository.CreateCategory(category, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Category UpdateCategory(Category category, IResolverContext context)
        {
            try
            {
                return _categoryRepository.UpdateCategory(category, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Category DeleteCategory(int categoryId, IResolverContext context)
        {
            try
            {
                return _categoryRepository.DeleteCategory(categoryId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Order CreateOrder(int inferiorId, int superiorId, Order order, IResolverContext context)
        {
            try
            {
                return _orderRepository.CreateOrder(inferiorId, superiorId, order, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Order UpdateOrder(Order order, IResolverContext context)
        {
            try
            {
                return _orderRepository.UpdateOrder(order, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Order DeleteOrder(int orderId, IResolverContext context)
        {
            try
            {
                return _orderRepository.DeleteOrder(orderId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
    }
}