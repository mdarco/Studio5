using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class PeriodModel
    {
        public int PeriodID { get; set; }
        public string PeriodName { get; set; }
        public string PeriodDesc { get; set; }
        public string WeekDay { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
    }
}
