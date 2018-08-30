using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class DanceGroupModel
    {
        public int DanceGroupID { get; set; }
        public string DanceGroupName { get; set; }
        public string DanceGroupDesc { get; set; }
        public Nullable<int> AgeCategoryID { get; set; }
        public string AgeCategory { get; set; }
        public bool? HasPaymentAbility { get; set; }

        // paging and sorting support
        public int PageNo { get; set; }
        public int RecordsPerPage { get; set; }
        public string OrderByClause { get; set; }
    }
}
