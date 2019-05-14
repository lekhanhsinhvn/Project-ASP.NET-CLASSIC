using Server.DB;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ServerContext _db;
        public RoleRepository(ServerContext db)
        {
            _db = db;
        }

        public Task<Role> CreateRole(Role role, CancellationToken cancellationToken)
        {
            if(_db.Roles.SingleOrDefault(i => i.Name == role.Name) != null)
            {
                throw new Exception("Already have that role");
            }
            role.CreatedDate = DateTime.Now;
            role.ModifiedDate = DateTime.Now;
            _db.Roles.Add(role);
            _db.SaveChanges();
            return Task.FromResult(role);
        }

        public Task<Role> DeleteRole(int RoleId, CancellationToken cancellationToken)
        {
            Role found = _db.Roles.FirstOrDefault(x => x.RoleId == RoleId);
            if (found != null)
            {
                _db.Roles.Remove(found);
                _db.SaveChanges();
            }
            return Task.FromResult(found);
        }

        public Task<Role> GetRole(int RoleId, CancellationToken cancellationToken)
        {
            Role found = _db.Roles.FirstOrDefault(x => x.RoleId == RoleId);
            if (found == null)
            {
                throw new Exception("Role doesn't exist.");
            }
            return Task.FromResult(found);
        }

        public Task<List<Role>> GetRoles(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            if (!_db.Roles.Any())
            {
                throw new Exception("No Results.");
            }
            List<Role> roles = _db.Roles.ToList();
            roles = FilterRoles(roles, search);
            roles = SortRoles(roles, sort, asc);
            roles.Skip(pageNum * maxPerPage);
            roles.Take(maxPerPage);

            return Task.FromResult(roles);
        }

        public Task<int> GetTotalCountRole(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Roles.Count());
        }

        public Task<Role> UpdateRole(Role role, CancellationToken cancellationToken)
        {
            var found = _db.Roles.SingleOrDefault(i => i.RoleId == role.RoleId);
            if (found == null)
            {
                throw new Exception("Role doesn't exist.");
            }
            found.Description = string.IsNullOrWhiteSpace(role.Description) ? found.Description : role.Description;
            found.Level = role.Level==null ? role.Level : found.Level;
            found.Users = role.Users;
            found.ModifiedDate = DateTime.Now;
            _db.SaveChanges();
            return Task.FromResult(_db.Roles.SingleOrDefault(i => i.RoleId == role.RoleId));
        }

        private List<Role> SortRoles(List<Role> roles, string sort, bool asc)
        {
            if (asc)
            {
                switch (sort)
                {
                    case "RoleId":
                        roles.Sort((x, y) => x.RoleId.Value.CompareTo(y.RoleId));
                        break;
                    default:
                        roles.Sort((x, y) => x.Name.CompareTo(y.Name));
                        break;
                    case "Level":
                        roles.Sort((x, y) => x.Level.Value.CompareTo(y.Level));
                        break;
                    case "CreatedDate":
                        roles.Sort((x, y) => x.CreatedDate.Value.CompareTo(y.CreatedDate));
                        break;
                    case "ModifiedDate":
                        roles.Sort((x, y) => x.ModifiedDate.Value.CompareTo(y.ModifiedDate));
                        break;
                }

            }
            else
            {
                switch (sort)
                {
                    case "RoleId":
                        roles.Sort((x, y) => y.RoleId.Value.CompareTo(x.RoleId));
                        break;
                    default:
                        roles.Sort((x, y) => y.Name.CompareTo(x.Name));
                        break;
                    case "Level":
                        roles.Sort((x, y) => y.Level.Value.CompareTo(x.Level));
                        break;
                    case "CreatedDate":
                        roles.Sort((x, y) => y.CreatedDate.Value.CompareTo(x.CreatedDate));
                        break;
                    case "ModifiedDate":
                        roles.Sort((x, y) => y.ModifiedDate.Value.CompareTo(x.ModifiedDate));
                        break;
                }
            }
            return roles;
        }

        private List<Role> FilterRoles(List<Role> roles, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                roles.Where(u => u.RoleId.ToString().Contains(search) ||
                                u.Level.ToString().Contains(search) ||
                                u.Name.Contains(search) ||
                                u.Description.Contains(search) ||
                                u.CreatedDate.ToString().Contains(search) ||
                                u.ModifiedDate.ToString().Contains(search));
            }
            return roles;
        }
    }
}