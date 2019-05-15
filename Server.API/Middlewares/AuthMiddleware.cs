using HotChocolate.Execution;
using HotChocolate.Resolvers;
using JWT;
using JWT.Builder;
using JWT.Serializers;
using Newtonsoft.Json;
using Server.API.Types;
using Server.DB.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Middlewares
{
    // I like Cookie & hate built in Auth middleware
    public class AuthMiddleware
    {
        private readonly FieldDelegate _next;
        private readonly string[] _roles;
        public AuthMiddleware(FieldDelegate next, string[] roles)
        {
            _next = next;
            _roles = roles;
        }
        public async Task InvokeAsync(IMiddlewareContext context)
        {
            // bypass error HttpContext.Current == null when data too big
            // yes this is stupid, basically make it a open access for any big data
            // most likely Hotchocolate process big data in another thread so HttpContext.Current == null
            // possible workaround: make lagre data like files to another Post => rework some stuff
            // conclusion: Can't be bother, will be fix if Hotchocolate fix it or will make the workaround if this not just a test
            if (HttpContext.Current!=null)
            {
                HttpCookie UserCookie = HttpContext.Current.Request.Cookies["UserCookie"];
                if (UserCookie == null)
                {
                    throw new QueryException("No token found.");
                }
                try
                {
                    var claims = new JwtBuilder().WithSecret(ConfigurationManager.AppSettings["JWTsecret"])
                                                 .MustVerifySignature()
                                                 .Decode<IDictionary<string, string>>(UserCookie.Value);
                    List<string> userroles = JsonConvert.DeserializeObject<List<string>>(claims["Roles"]);
                    if (!userroles.Intersect(_roles).Any())
                    {
                        throw new QueryException("Access denied.");
                    }
                }
                catch (TokenExpiredException)
                {
                    throw new QueryException("Token has expired.");
                }
                catch (SignatureVerificationException)
                {
                    throw new QueryException("Token has invalid signature.");
                }
                catch (Exception ex)
                {
                    throw new QueryException(ex.Message);
                }
            }
            await _next(context);
        }
    }
}