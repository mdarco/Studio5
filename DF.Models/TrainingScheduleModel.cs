using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class TrainingScheduleModel
    {
        public int ID { get; set; }
        public int TrainingLocationID { get; set; }
        public string TrainingLocationName { get; set; }
        public string WeekDay { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Note { get; set; }
    }
}
