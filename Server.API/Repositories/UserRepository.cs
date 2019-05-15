using Client;
using Server.DB;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;


namespace Server.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ServerContext _db;
        private readonly IFileHandler _fileHandler;
        public UserRepository(ServerContext db, IFileHandler fileHandler)
        {
            _db = db;
            _fileHandler = fileHandler;
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
            return Task.FromResult(removePassword(user));
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
            List<User> users = _db.Users.ToList();
            users = FilterUsers(users, search);
            users = SortUsers(users, sort, asc);
            users = users.Skip(pageNum * maxPerPage).ToList();
            users = users.Take(maxPerPage).ToList();
            if (!users.Any())
            {
                throw new Exception("No Results.");
            }
            
            return Task.FromResult(removePasswordfromList(users));
        }

        /// <summary>
        /// Get the total count of users in database
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<int> GetTotalCountUser(CancellationToken cancellationToken)
        {
            int count = _db.Users.Count();
            return Task.FromResult(count);
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
            Role role = null;
            user.Roles = new List<Role>();
            // Create Admin role if User table is empty
            if (_db.Users.Any())
            {
                role = _db.Roles.SingleOrDefault(i => i.Name.Equals("User"));
                user.SuperiorId = 1000;
            }
            else
            {
                role = _db.Roles.SingleOrDefault(i => i.Name.Equals("Admin"));
                user.SuperiorId = 0;
            }
            user.Roles.Add(role);
            if (ValidateUser(user))
            {
                if (_db.Users.SingleOrDefault(i => i.Email == user.Email) != null)
                {
                    throw new Exception("The Email is already in use.");
                }
                else
                {
                    user.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password, hashType: BCrypt.Net.HashType.SHA384);
                    if (string.IsNullOrWhiteSpace(user.Avatar))
                    {
                        user.Avatar = "default.png";
                    }
                    user.CreatedDate = DateTime.Now;
                    user.ModifiedDate = DateTime.Now;
                    _db.Users.Add(user);
                    _db.SaveChanges();
                }
            }
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
            if (user == null)
            {
                throw new Exception("User doesn't exist.");
            }
            _db.Users.Remove(user);
            _db.SaveChanges();
            return Task.FromResult(user);
        }

        /// <summary>
        /// Update user required correct Password, can change Password field
        /// </summary>
        /// <param name="user"></param>
        /// <param name="newPassword"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<User> UpdateSelf(User user, string base64String, string newPassword, CancellationToken cancellationToken)
        {
            user.Password = "12345";
            if (ValidateUser(user))
            {
                var found = _db.Users.SingleOrDefault(i => i.UserId == user.UserId);
                if (found == null)
                {
                    throw new Exception("User doesn't exist.");
                }
                found.Name = string.IsNullOrWhiteSpace(user.Name) ? found.Name : user.Name;

                if (!string.IsNullOrWhiteSpace(base64String))
                {
                    user.Avatar = DateTime.Now.ToString("yyyy-dd-M--HH-mm-ss") + "_" + user.Name + ".png";
                    _fileHandler.ImageSave(base64String, user.Avatar);
                    _fileHandler.ImageRemove(found.Avatar);
                    found.Avatar = user.Avatar;
                }

                if (!string.IsNullOrWhiteSpace(newPassword))
                {
                    found.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(newPassword, hashType: BCrypt.Net.HashType.SHA384);
                }
                user.ModifiedDate = DateTime.Now;
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
        public Task<User> UpdateUser(User user, string base64String, CancellationToken cancellationToken)
        {
            // bypass validate password
            user.Password = "12345";

            if (ValidateUser(user))
            {
                var found = _db.Users.SingleOrDefault(i => i.UserId == user.UserId);
                if (found == null)
                {
                    throw new Exception("User doesn't exist.");
                }

                found.Name = string.IsNullOrWhiteSpace(user.Name) ? found.Name : user.Name;

                if (!string.IsNullOrWhiteSpace(base64String))
                {
                    user.Avatar = DateTime.Now.ToString("yyyy-dd-M--HH-mm-ss") + "_" + user.Name + ".png";
                    _fileHandler.ImageSave(base64String, user.Avatar);
                    _fileHandler.ImageRemove(found.Avatar);
                    found.Avatar = user.Avatar;
                }
                if(user.Roles != null)
                {
                    found.Roles.Clear();
                    foreach(Role role in user.Roles)
                    {
                        Role r = _db.Roles.SingleOrDefault(i => i.RoleId == role.RoleId);
                        if(r!=null)
                        {
                            found.Roles.Add(r);
                        }
                    }
                }
                found.SuperiorId = (_db.Users.SingleOrDefault(i => i.UserId == user.SuperiorId) == null) ? found.SuperiorId : user.SuperiorId;
                found.ModifiedDate = DateTime.Now;
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
        private List<User> SortUsers(List<User> users, string sort, bool asc)
        {
            if (users != null)
            {
                if (asc)
                {
                    switch (sort)
                    {
                        case "UserId":
                            users.Sort((x, y) => x.UserId.Value.CompareTo(y.UserId));
                            break;
                        default:
                            users.Sort((x, y) => x.Name.CompareTo(y.Name));
                            break;
                        case "Email":
                            users.Sort((x, y) => x.Email.CompareTo(y.Email));
                            break;
                        //case "Role":
                        //    users.Sort((x, y) => x.Roles.CompareTo(y.Roles));
                        //    break;
                        case "SuperiorId":
                            users.Sort((x, y) => x.SuperiorId.Value.CompareTo(y.SuperiorId));
                            break;
                        case "CreatedDate":
                            users.Sort((x, y) => x.CreatedDate.Value.CompareTo(y.CreatedDate));
                            break;
                        case "ModifiedDate":
                            users.Sort((x, y) => x.ModifiedDate.Value.CompareTo(y.ModifiedDate));
                            break;
                    }

                }
                else
                {
                    switch (sort)
                    {
                        case "UserId":
                            users.Sort((x, y) => y.UserId.Value.CompareTo(x.UserId));
                            break;
                        default:
                            users.Sort((x, y) => y.Name.CompareTo(x.Name));
                            break;
                        case "Email":
                            users.Sort((x, y) => y.Email.CompareTo(x.Email));
                            break;
                        //case "Role":
                        //  users.Sort((x, y) => y.Role.CompareTo(x.Role));
                        //    break;
                        case "SuperiorId":
                            users.Sort((x, y) => y.SuperiorId.Value.CompareTo(x.SuperiorId));
                            break;
                        case "CreatedDate":
                            users.Sort((x, y) => y.CreatedDate.Value.CompareTo(x.CreatedDate));
                            break;
                        case "ModifiedDate":
                            users.Sort((x, y) => y.ModifiedDate.Value.CompareTo(x.ModifiedDate));
                            break;
                    }
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
                 return users.Where(u => u.UserId.ToString().Contains(search) ||
                                   u.Name.Contains(search) ||
                                   u.Email.Contains(search) ||
                                   (u.Roles.SingleOrDefault(i => i.Name.Contains(search)) != null) ||
                                   u.CreatedDate.ToString().Contains(search) ||
                                   u.ModifiedDate.ToString().Contains(search)).ToList();
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
                Roles = user.Roles,
                SuperiorId = user.SuperiorId,
                CreatedDate = user.CreatedDate,
                ModifiedDate = user.ModifiedDate,
                InferiorOrders = user.InferiorOrders,
                SuperiorOrders = user.SuperiorOrders,
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