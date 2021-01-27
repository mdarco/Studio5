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
        public List<TrainingScheduleModel> GetActiveTrainingSchedules()
        {
            var schedules = DB.Trainings.GetTrainingSchedules();

            if (schedules != null)
            {
                foreach(var s in schedules)
                {
                    s.Name = s.TrainingLocationName + ": " + s.StartTime.ToString(@"hh\:mm") + " - " + s.EndTime.ToString(@"hh\:mm");

                    switch(s.WeekDay.ToLower())
                    {
                        case "nedelja":
                            s.WeekDayNo = 0;
                            break;

                        case "ponedeljak":
                            s.WeekDayNo = 1;
                            break;

                        case "utorak":
                            s.WeekDayNo = 2;
                            break;

                        case "sreda":
                            s.WeekDayNo = 3;
                            break;

                        case "četvrtak":
                            s.WeekDayNo = 4;
                            break;

                        case "petak":
                            s.WeekDayNo = 5;
                            break;

                        case "subota":
                            s.WeekDayNo = 6;
                            break;
                    }
                }
            }

            return schedules;
        }

        [Route("all")]
        [HttpGet]
        public List<TrainingScheduleModel> GetAllTrainingSchedules()
        {
            var schedules = DB.Trainings.GetAllTrainingSchedules();

            if (schedules != null)
            {
                foreach (var s in schedules)
                {
                    s.Name = s.TrainingLocationName + ": " + s.StartTime.ToString(@"hh\:mm") + " - " + s.EndTime.ToString(@"hh\:mm");

                    switch (s.WeekDay.ToLower())
                    {
                        case "nedelja":
                            s.WeekDayNo = 0;
                            break;

                        case "ponedeljak":
                            s.WeekDayNo = 1;
                            break;

                        case "utorak":
                            s.WeekDayNo = 2;
                            break;

                        case "sreda":
                            s.WeekDayNo = 3;
                            break;

                        case "četvrtak":
                            s.WeekDayNo = 4;
                            break;

                        case "petak":
                            s.WeekDayNo = 5;
                            break;

                        case "subota":
                            s.WeekDayNo = 6;
                            break;
                    }
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

        [Route("{id}/set-active")]
        [HttpPut]
        public void SetActive(TrainingScheduleModel model)
        {
            DB.Trainings.SetActive(model);
        }
    }
}
