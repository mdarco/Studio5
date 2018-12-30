using DF.BL;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/token")]
    public class TokenController : ApiController
    {
        [Route("check")]
        [HttpPost]
        public bool CheckToken(string token)
        {
            try
            {
                TokenManager.DecodeToken(token);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        [Route("create")]
        [HttpPost]
        public string CreateToken(List<ClaimModel> claims)
        {
            return TokenManager.CreateToken(claims);
        }
    }
}
