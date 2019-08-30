using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/lookups")]
    public class LookupsController : ApiController
    {
        [Route("age-categories")]
        [HttpGet]
        public List<LookupModel> GetAgeCategories()
        {
            return DB.Lookups.GetAgeCategories();
        }

        [Route("locations")]
        [HttpGet]
        public List<LookupModel> GetLocations()
        {
            return DB.Lookups.GetLocations();
        }

        [Route("users")]
        [HttpGet]
        public List<LookupModel> GetUsers()
        {
            return DB.Lookups.GetUsers();
        }
    }
}
