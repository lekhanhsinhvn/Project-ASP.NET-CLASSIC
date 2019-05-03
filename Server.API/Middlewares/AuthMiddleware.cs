using HotChocolate.Execution;
using HotChocolate.Resolvers;
using JWT;
using JWT.Builder;
using JWT.Serializers;
using Server.API.Types;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Server.API.Middlewares
{
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
            HttpCookie UserCookie = HttpContext.Current.Request.Cookies["UserCookie"];
            if (UserCookie == null)
            {
                throw new QueryException("No token found.");
            }
            try
            {
                var claims = new JwtBuilder()
                                                .WithSecret(ConfigurationManager.AppSettings["JWTsecret"])
                                                .MustVerifySignature()
                                                .Decode<IDictionary<string, object>>(UserCookie.Value);
                if (!_roles.Contains(claims["Role"].ToString()))
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

            await _next(context);
        }
    }
}