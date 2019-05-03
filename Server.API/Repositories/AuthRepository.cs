using JWT.Algorithms;
using JWT.Builder;
using Server.DB;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ServerContext _db;
        public AuthRepository(ServerContext db)
        {
            _db = db;
        }

        public Task<string> Login(string email, string password, CancellationToken cancellationToken)
        {
            var found = _db.Users.SingleOrDefault(i => i.Email == email);
            if (found == null)
            {
                throw new Exception("Incorrect Email.");
            }
            if (!BCrypt.Net.BCrypt.EnhancedVerify(password, found.Password, hashType: BCrypt.Net.HashType.SHA384))
            {
                throw new Exception("Incorrect password.");
            }
            var token = new JwtBuilder()
                  .WithAlgorithm(new HMACSHA256Algorithm())
                  .WithSecret(ConfigurationManager.AppSettings["JWTsecret"])
                  .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds())
                  .AddClaim("UserId", found.UserId)
                  .AddClaim("Role", found.Role)
                  .Build();
            return Task.FromResult(token);
        }
    }
}