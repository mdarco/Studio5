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

        //this.ChoreographyMembers = new HashSet<ChoreographyMembers>();
        //this.DanceGroupMembers = new HashSet<DanceGroupMembers>();
        //this.DanceSelectionMembers = new HashSet<DanceSelectionMembers>();
        //this.MemberDocuments = new HashSet<MemberDocuments>();
        //this.MemberImages = new HashSet<MemberImages>();
        //this.MemberPaymentItems = new HashSet<MemberPaymentItems>();
        //this.MemberPayments = new HashSet<MemberPayments>();
        //this.MemberPaymentsForCompanions = new HashSet<MemberPaymentsForCompanions>();
        //this.Performances = new HashSet<Performances>();
        //this.TrainingMemberPresenceRegistrations = new HashSet<TrainingMemberPresenceRegistrations>();
    }
}
