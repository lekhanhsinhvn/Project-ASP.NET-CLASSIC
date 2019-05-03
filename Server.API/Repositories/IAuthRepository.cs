using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Repositories
{
    public interface IAuthRepository
    {
        Task<string> Login(string email, string password, CancellationToken cancellationToken);
    }
}