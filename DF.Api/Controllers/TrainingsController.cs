using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
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

        [Route("{id}")]
        [HttpGet]
        public TrainingModel GetTraining(int id)
        {
            return DB.Trainings.GetTraining(id);
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
        [HttpPut]
        public void EditTraining(TrainingModel model)
        {
            try
            {
                DB.Trainings.EditTraining(model);
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

        #region Member presence

        [Route("{id}/member-presence")]
        [HttpGet]
        public IEnumerable<TrainingMemberPresenceRegistrationModel> GetMemberPresenceRegistrations(int id)
        {
            return DB.Trainings.GetTrainingMemberPresenceRegistrations(id);
        }

        [Route("{id}/member-presence/{memberID}")]
        [HttpPost]
        public void UpdateTrainingMemberPresenceRegistration(int id, int memberID, TrainingMemberPresenceRegistrationModel model)
        {
            model.TrainingID = id;
            model.MemberID = memberID;
            DB.Trainings.UpdateTrainingMemberPresenceRegistration(model);
        }

        #endregion
    }
}
