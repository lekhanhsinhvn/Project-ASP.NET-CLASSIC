using Server.DB;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ServerContext _db;
        public UserRepository(ServerContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Get user from UserId
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> GetUser(int UserId, CancellationToken cancellationToken)
        {
            User user = _db.Users.FirstOrDefault(x => x.UserId == UserId);
            if(user == null)
            {
                throw new Exception("User doesn't exist.");
            }
            else
            {
                return Task.FromResult(removePassword(user));
            }
            
        }

        /// <summary>
        /// Get list of users in database
        /// </summary>
        /// <param name="pageNum"></param>
        /// <param name="maxPerPage"></param>
        /// <param name="sort"></param>
        /// <param name="search"></param>
        /// <param name="asc"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<List<User>> GetUsers(int pageNum, int maxPerPage, string sort, string search, bool asc, CancellationToken cancellationToken)
        {
            if (!_db.Users.Any())
            {
                throw new Exception("No Results.");
            }
            List<User> users = _db.Users.ToList();
            users = FilterUsers(users, search);
            users = SortUsers(users, sort, asc);
            users.Skip(pageNum * maxPerPage);
            users.Take(maxPerPage);
            
            return Task.FromResult(removePasswordfromList(users));
        }

        /// <summary>
        /// Get the total count of users in database
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<int> GetTotalCountUser(CancellationToken cancellationToken)
        {
            return Task.FromResult(_db.Users.Count());
        }

        /// <summary>
        /// Create new user into database
        /// </summary>
        /// <param name="user"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> CreateUser(User user, CancellationToken cancellationToken)
        {
            // only create User role
           // user.Role = "User";
            user.SuperiorId = 1000;
            // Create Admin role if User table is empty
            if (!_db.Users.Any())
            {
             //   user.Role = "Admin";
                user.SuperiorId = 0;
            }
            if (ValidateUser(user))
            {
                if (_db.Users.SingleOrDefault(i => i.Email == user.Email) != null)
                {
                    throw new Exception("The Email is already in use.");
                }
                user.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password, hashType: BCrypt.Net.HashType.SHA384);
                if (string.IsNullOrWhiteSpace(user.Avatar))
                {
                    user.Avatar = "default.png";
                }
                _db.Users.Add(user);
            }
            _db.SaveChanges();
            return Task.FromResult(removePassword(_db.Users.SingleOrDefault(i => i.Email == user.Email)));
        }

        /// <summary>
        /// Remove user from database
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> DeleteUser(int UserId, CancellationToken cancellationToken)
        {
            User user = _db.Users.FirstOrDefault(x => x.UserId == UserId);
            if (user != null)
            {
                _db.Users.Remove(user);
                _db.SaveChanges();
            }
            return Task.FromResult(user);
        }

        /// <summary>
        /// Update user required correct Password, can change Password field
        /// </summary>
        /// <param name="user"></param>
        /// <param name="newPassword"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> UpdateSelf(User user, string newPassword, CancellationToken cancellationToken)
        {
            if (ValidateUser(user))
            {
                var found = _db.Users.SingleOrDefault(i => i.UserId == user.UserId);
                if (found != null)
                {
                    if (!BCrypt.Net.BCrypt.EnhancedVerify(user.Password, found.Password, hashType: BCrypt.Net.HashType.SHA384))
                    {
                        throw new Exception("Incorrect password.");
                    }
                    found.Name = string.IsNullOrWhiteSpace(user.Name) ? found.Name : user.Name;
                    found.Avatar = string.IsNullOrWhiteSpace(user.Avatar) ? found.Avatar : user.Avatar;
                    if (!string.IsNullOrWhiteSpace(newPassword))
                    {
                        found.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(newPassword, hashType: BCrypt.Net.HashType.SHA384);
                    }

                }
                _db.SaveChanges();
            }
            return Task.FromResult(removePassword(_db.Users.SingleOrDefault(i => i.Email == user.Email)));
        }

        /// <summary>
        /// Update user without update Passowrd field
        /// </summary>
        /// <param name="user"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> UpdateUser(User user, CancellationToken cancellationToken)
        {
            // bypass validate password
            user.Password = "12345";

            if (ValidateUser(user))
            {
                var found = _db.Users.SingleOrDefault(i => i.UserId == user.UserId);
                if (found != null)
                {
                    found.Name = string.IsNullOrWhiteSpace(user.Name) ? found.Name : user.Name;
                    found.Avatar = string.IsNullOrWhiteSpace(user.Avatar) ? found.Avatar : user.Avatar;
               //     found.Role = string.IsNullOrWhiteSpace(user.Role) ? found.Role : user.Role;
                    found.SuperiorId = (_db.Users.SingleOrDefault(i => i.UserId == user.SuperiorId) == null) ? found.SuperiorId : user.SuperiorId;
                }
                _db.SaveChanges();
            }
            return Task.FromResult(removePassword(_db.Users.SingleOrDefault(i => i.Email == user.Email)));
        }

        /// <summary>
        /// Validate user object by DataAnnotation & throw Exception
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public bool ValidateUser(User user)
        {
            ValidationContext validationContext = new ValidationContext(user, null, null);
            List<ValidationResult> results = new List<ValidationResult>();
            bool valid = Validator.TryValidateObject(user, validationContext, results, true);
            if (!valid)
            {
                throw new Exception(results[0].ErrorMessage);
            }
            return valid;
        }

        /// <summary>
        /// Sort list of user by UserId, Name, Email or Role
        /// </summary>
        /// <param name="users"></param>
        /// <param name="sort"></param>
        /// <param name="asc"></param>
        /// <returns></returns>
        public List<User> SortUsers(List<User> users, string sort, bool asc)
        {
            if (asc)
            {
                switch (sort)
                {
                    case "UserId":
                        users.Sort((x, y) => x.UserId.CompareTo(y.UserId));
                        break;
                    case "Name":
                        users.Sort((x, y) => x.Name.CompareTo(y.Name));
                        break;
                    case "Email":
                        users.Sort((x, y) => x.Email.CompareTo(y.Email));
                        break;
                    case "Role":
                //        users.Sort((x, y) => x.Role.CompareTo(y.Role));
                        break;
                    case "SuperiorId":
                        users.Sort((x, y) => x.SuperiorId.CompareTo(y.SuperiorId));
                        break;
                }

            }
            else
            {
                switch (sort)
                {
                    case "UserId":
                        users.Sort((x, y) => y.UserId.CompareTo(x.UserId));
                        break;
                    case "Name":
                        users.Sort((x, y) => y.Name.CompareTo(x.Name));
                        break;
                    case "Email":
                        users.Sort((x, y) => y.Email.CompareTo(x.Email));
                        break;
                    case "Role":
                  //      users.Sort((x, y) => y.Role.CompareTo(x.Role));
                        break;
                    case "SuperiorId":
                        users.Sort((x, y) => y.SuperiorId.CompareTo(x.SuperiorId));
                        break;
                }
            }
            return users;
        }

        /// <summary>
        /// Filter list of user by search string
        /// </summary>
        /// <param name="users"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        private List<User> FilterUsers(List<User> users, string search)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                users.Where(u => u.UserId.ToString().Contains(search) ||
                                u.Name.Contains(search) ||
                                u.Email.Contains(search)) ;
                               // || u.Role.Contains(search));
            }
            return users;
        }

        /// <summary>
        /// Return another instance of user without password
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private User removePassword(User user)
        {
            User _user = new User()
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Avatar = user.Avatar,
                Password = "",
                //Role = user.Role,
                SuperiorId = user.SuperiorId,
            };
            return _user;
        }

        /// <summary>
        /// Return another list of user without password
        /// </summary>
        /// <param name="users"></param>
        /// <returns></returns>
        private List<User> removePasswordfromList(List<User> users)
        {
            List<User> _users = new List<User>();
            foreach (User u in users)
            {
                _users.Add(removePassword(u));
            }
            return _users;
        }
    }
}