using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MemberFilterModel
    {
        public string FullName { get; set; }
        public string JMBG { get; set; }
        public bool? ExcludeNonActive { get; set; }
        public int? ChoreoID { get; set; }
        public List<int> DanceGroupID { get; set; }
        public int? DanceSelectionID { get; set; }
        public int? EventID { get; set; }

        // paging and sorting support
        public int PageNo { get; set; }
        public int RecordsPerPage { get; set; }
        public string OrderByClause { get; set; }
    }
}
