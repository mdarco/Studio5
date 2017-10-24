using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/events")]
    public class EventsController : ApiController
    {
        [Route("lookup")]
        [HttpGet]
        public List<LookupModel> GetLookup()
        {
            return DB.Events.GetLookup();
        }
    }
}
