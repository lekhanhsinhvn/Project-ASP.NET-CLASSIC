using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Resolvers;
using Server.API.Repositories;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server.API.GraphQLSchema
{
    public class Mutation
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthRepository _authRepository;
        private readonly IRoleRepository _roleRepository;
        public Mutation(IUserRepository userRepository, IAuthRepository authRepository, IRoleRepository roleRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
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

        public User UpdateSelf(User user, string newPassword, IResolverContext context)
        {
            try
            {
                return _userRepository.UpdateSelf(user, newPassword, context.RequestAborted).Result;
            }
            catch (Exception ex)
            {
                context.ReportError(ex.Message);
            }
            return null;
        }

        public User UpdateUser(User user, IResolverContext context)
        {
            try
            {
                return _userRepository.UpdateUser(user, context.RequestAborted).Result;
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
    }
}