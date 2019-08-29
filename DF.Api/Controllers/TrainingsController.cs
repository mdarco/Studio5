using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using DF.Models;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/trainings")]
    public class TrainingsController : ApiController
    {
        [Route("filtered")]
        [HttpPost]
        public ApiTableResponseModel<TrainingModel> GetFilteredTrainings(TrainingFilter filter)
        {
            return DB.Trainings.GetTrainingsFiltered(filter);
        }

        [Route("")]
        [HttpPost]
        public void CreateTraining(TrainingModel model)
        {
            try
            {
                DB.Trainings.CreateTraining(model);
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
        [HttpDelete]
        public void DeleteTraining(int id)
        {
            try
            {
                DB.Trainings.DeleteTraining(id);
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

        [Route("{id}/member-presence")]
        [HttpGet]
        public IEnumerable<TrainingMemberPresenceRegistrationModel> GetMemberPresenceRegistrations(int id)
        {
            return DB.Trainings.GetTrainingMemberPresenceRegistrations(id);
        }

        [Route("{id}/member-presence/{memberID}")]
        [HttpPost]
        public void UpdateTrainingMemberPresenceRegistration(TrainingMemberPresenceRegistrationModel model)
        {
            DB.Trainings.UpdateTrainingMemberPresenceRegistration(model);
        }
    }
}
