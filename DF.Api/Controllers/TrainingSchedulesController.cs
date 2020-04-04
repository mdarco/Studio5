using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DF.Models;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/training-schedules")]
    public class TrainingSchedulesController : ApiController
    {
        [Route("")]
        [HttpGet]
        public List<TrainingScheduleModel> GetTrainingSchedules()
        {
            var schedules = DB.Trainings.GetTrainingSchedules();

            if (schedules != null)
            {
                foreach(var s in schedules)
                {
                    s.Name = s.TrainingLocationName + ": " + s.StartTime.ToString(@"hh\:mm") + " - " + s.EndTime.ToString(@"hh\:mm");
                }
            }

            return schedules;
        }

        [Route("")]
        [HttpPost]
        public int CreateTrainingSchedule(TrainingScheduleModel model)
        {
            return DB.Trainings.CreateTrainingSchedule(model);
        }

        [Route("{id}")]
        [HttpDelete]
        public void DeleteTraining(int id)
        {
            DB.Trainings.DeleteTrainingSchedule(id);
        }
    }
}
