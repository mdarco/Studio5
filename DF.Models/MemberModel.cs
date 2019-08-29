using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MemberModel
    {
        public int? MemberID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string JMBG { get; set; }
        public DateTime? BirthDate { get; set; }
        public string BirthPlace { get; set; }
        public int? AgeCategoryID { get; set; }
        public string AgeCategory { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsCompetitor { get; set; }
        public string Note { get; set; }
        public string ProfileImage { get; set; }

        public ContactDataModel ContactData { get; set; }

        public int? DanceGroupID { get; set; }
        public string DanceGroups { get; set; }
    }
}
