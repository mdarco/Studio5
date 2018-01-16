using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/dance-groups")]
    public class DanceGroupsController : ApiController
    {
        [Route("lookup")]
        [HttpGet]
        public List<LookupModel> GetLookup()
        {
            return DB.DanceGroups.GetLookup();
        }

        [Route("filtered")]
        [HttpPost]
        public ApiTableResponseModel<DanceGroupModel> GetDanceGroups(DanceGroupModel filter)
        {
            return DB.DanceGroups.GetDanceGroups(filter);
        }

        [Route("{id}")]
        [HttpGet]
        public DanceGroupModel GetDanceGroup(int id)
        {
            return DB.DanceGroups.GetDanceGroup(id);
        }

        [Route("")]
        [HttpPost]
        public DanceGroupModel CreateDanceGroup(DanceGroupModel model)
        {
            try
            {
                return DB.DanceGroups.CreateDanceGroup(model);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        ReasonPhrase = ex.Message
                    });
            }
        }

        [Route("{id}")]
        [HttpPut]
        public void UpdateDanceGroup(DanceGroupModel model)
        {
            DB.DanceGroups.UpdateDanceGroup(model);
        }

        [Route("{id}")]
        [HttpDelete]
        public void DeleteDanceGroup(int id)
        {
            try
            {
                DB.DanceGroups.DeleteDanceGroup(id);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        ReasonPhrase = ex.Message
                    });
            }
        }
    }
}
