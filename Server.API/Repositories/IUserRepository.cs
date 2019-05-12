using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Server.API.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUser(int UserId, CancellationToken cancellationToken);

        Task<List<User>> GetUsers(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<int> GetTotalCountUser(CancellationToken cancellationToken);

        Task<User> UpdateUser(User user, string base64String, CancellationToken cancellationToken);

        Task<User> DeleteUser(int UserId, CancellationToken cancellationToken);

        Task<User> UpdateSelf(User user, string base64String, string newPassword, CancellationToken cancellationToken);

        Task<User> CreateUser(User user, CancellationToken cancellationToken);

    }
}
