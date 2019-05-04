using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public interface IRoleRepository
    {
        Task<Role> GetRole(int RoleId, CancellationToken cancellationToken);

        Task<List<Role>> GetRoles(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken);

        Task<int> GetTotalCountRole(CancellationToken cancellationToken);

        Task<Role> CreateRole(Role role, CancellationToken cancellationToken);

        Task<Role> UpdateRole(Role role, CancellationToken cancellationToken);

        Task<Role> DeleteRole(int RoleId, CancellationToken cancellationToken);
    }
}