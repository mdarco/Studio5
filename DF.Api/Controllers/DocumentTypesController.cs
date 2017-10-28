using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/doc-types")]
    public class DocumentTypesController : ApiController
    {
        [Route("lookup")]
        [HttpGet]
        public List<LookupModel> GetDocTypesAsLookup()
        {
            return DB.Documents.GetDocTypesAsLookup();
        }
    }
}
