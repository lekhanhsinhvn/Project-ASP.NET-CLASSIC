using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Resolvers;
using Server.API.Repositories;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.GraphQLSchema
{
    public class Query
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IOrderRepository _orderRepository;

        public Query(IUserRepository userRepository, IRoleRepository roleRepository, IProductRepository productRepository, ICategoryRepository categoryRepository, IOrderRepository orderRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        }
        public User GetUser(int userId, IResolverContext context)
        {
            try
            {
                return _userRepository.GetUser(userId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
        public List<User> GetUsers(int? pageNum, int? maxPerPage, string sort, string search, bool? asc, IResolverContext context)
        {
            //default
            if (string.IsNullOrWhiteSpace(sort))
            {
                sort = "Name";
            }
            if (asc == null)
            {
                asc = true;
            }
            if (pageNum == null)
            {
                pageNum = 0;
            }
            if (maxPerPage == null)
            {
                maxPerPage = 10;
            }

            try
            {
                return _userRepository.GetUsers(pageNum.Value, maxPerPage.Value, sort, search, asc.Value, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Role GetRole(int RoleId, IResolverContext context)
        {
            try
            {
                return _roleRepository.GetRole(RoleId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
        public List<Role> GetRoles(int? pageNum, int? maxPerPage, string sort, string search, bool? asc, IResolverContext context)
        {
            //default
            if (string.IsNullOrWhiteSpace(sort))
            {
                sort = "Name";
            }
            if (asc == null)
            {
                asc = true;
            }
            if (pageNum == null)
            {
                pageNum = 0;
            }
            if (maxPerPage == null)
            {
                maxPerPage = 10;
            }

            try
            {
                return _roleRepository.GetRoles(pageNum.Value, maxPerPage.Value, sort, search, asc.Value, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Product GetProduct(int ProductId, IResolverContext context)
        {
            try
            {
                return _productRepository.GetProduct(ProductId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
        public List<Product> GetProducts(int? pageNum, int? maxPerPage, string sort, string search, bool? asc, IResolverContext context)
        {
            //default
            if (string.IsNullOrWhiteSpace(sort))
            {
                sort = "Name";
            }
            if (asc == null)
            {
                asc = true;
            }
            if (pageNum == null)
            {
                pageNum = 0;
            }
            if (maxPerPage == null)
            {
                maxPerPage = 10;
            }

            try
            {
                return _productRepository.GetProducts(pageNum.Value, maxPerPage.Value, sort, search, asc.Value, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Category GetCategory(int CategoryId, IResolverContext context)
        {
            try
            {
                return _categoryRepository.GetCategory(CategoryId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
        public List<Category> GetCategories(int? pageNum, int? maxPerPage, string sort, string search, bool? asc, IResolverContext context)
        {
            //default
            if (string.IsNullOrWhiteSpace(sort))
            {
                sort = "Name";
            }
            if (asc == null)
            {
                asc = true;
            }
            if (pageNum == null)
            {
                pageNum = 0;
            }
            if (maxPerPage == null)
            {
                maxPerPage = 10;
            }

            try
            {
                return _categoryRepository.GetCategorys(pageNum.Value, maxPerPage.Value, sort, search, asc.Value, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public Order GetOrder(int OrderId, IResolverContext context)
        {
            try
            {
                return _orderRepository.GetOrder(OrderId, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
        public List<Order> GetOrders(int? pageNum, int? maxPerPage, string sort, string search, bool? asc, IResolverContext context)
        {
            //default
            if (string.IsNullOrWhiteSpace(sort))
            {
                sort = "ModifiedDate";
            }
            if (asc == null)
            {
                asc = false;
            }
            if (pageNum == null)
            {
                pageNum = 0;
            }
            if (maxPerPage == null)
            {
                maxPerPage = 10;
            }

            try
            {
                return _orderRepository.GetOrders(pageNum.Value, maxPerPage.Value, sort, search, asc.Value, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }
    }
}