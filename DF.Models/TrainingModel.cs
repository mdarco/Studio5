using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class TrainingModel
    {
        public int TrainingID { get; set; }
        public DateTime TrainingDate { get; set; }
        public int TrainingLocationID { get; set; }
        public string TrainingLocationName { get; set; }
        public int? TrainingDanceGroupID { get; set; }
        public string TrainingDanceGroupName { get; set; }
        public int? TrainingDanceSelectionID { get; set; }
        public string TrainingDanceSelectionName { get; set; }
        public string WeekDay { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int? TrainerUserID { get; set; }
        public string TrainerUserName { get; set; }
        public string Note { get; set; }

        public int TrainingScheduleID { get; set; }

        public IEnumerable<TrainingMemberPresenceRegistrationModel> TrainingMemberPresenceRegistrations { get; set; }
    }
}
