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
        public Query(IUserRepository userRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
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
    }
}