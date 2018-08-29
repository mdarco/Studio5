using DF.DB;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/settings/user-groups")]
    public class UserGroupsController : ApiController
    {
        [Route("")]
        [HttpGet]
        public List<UserGroupModel> GetUserGroups()
        {
            return UserGroups.GetUserGroups();
        }
    }
}
