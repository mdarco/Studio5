using DF.Models;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace DF.BL
{
    public static class TokenManager
    {
        public static string CreateToken(List<ClaimModel> claims)
        {
            string secret = ConfigurationManager.AppSettings["token::salt"].ToString();
            string tokenExp = ConfigurationManager.AppSettings["token::exp"].ToString();

            var token = new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(secret)
                .AddClaim("exp", DateTimeOffset.UtcNow.AddSeconds(Int32.Parse(tokenExp)).ToUnixTimeSeconds());

            foreach (var claim in claims)
            {
                token.AddClaim(claim.Name, claim.Value);
            }

            return token.Build();
        }

        public static List<ClaimModel> DecodeToken(string token)
        {
            try
            {
                List<ClaimModel> claims = new List<ClaimModel>();

                string secret = ConfigurationManager.AppSettings["token::salt"].ToString();

                var payload = new JwtBuilder()
                    .WithSecret(secret)
                    .MustVerifySignature()
                    .Decode<IDictionary<string, object>>(token);

                foreach (var claim in payload)
                {
                    claims.Add(new ClaimModel() { Name = claim.Key, Value = claim.Value.ToString() });
                }

                return claims;
            }
            catch (TokenExpiredException)
            {
                throw new Exception("error_token_expired");
            }
            catch (SignatureVerificationException)
            {
                throw new Exception("error_token_invalid_signature");
            }
        }
    }
}
