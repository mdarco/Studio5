using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/members")]
    public class MembersController : ApiController
    {
        [Route("filtered")]
        [HttpPost]
        public ApiTableResponseModel<MemberModel> GetFilteredMembers(MemberFilterModel filter)
        {
            return DB.Members.GetFilteredMembers(filter);
        }

        [Route("{id}")]
        [HttpGet]
        public MemberModel GetMember(int id)
        {
            return DB.Members.GetMember(id);
        }

        [Route("")]
        [HttpPost]
        public void CreateMember(MemberModel model)
        {
            try
            {
                DB.Members.CreateMember(model);
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
        public void EditMember(int id, MemberModel model)
        {
            try
            {
                DB.Members.EditMember(id, model);
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
