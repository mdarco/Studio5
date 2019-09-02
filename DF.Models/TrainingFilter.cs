using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class TrainingFilter
    {
        public DateTime? TrainingDate { get; set; }
        public int? TrainingLocationID { get; set; }
        public int? TrainingDanceGroupID { get; set; }
        public string WeekDay { get; set; }
        public int? TrainerUserID { get; set; }

        
        // paging and sorting support
        public int PageNo { get; set; }
        public int RecordsPerPage { get; set; }
        public string OrderByClause { get; set; }
    }
}
