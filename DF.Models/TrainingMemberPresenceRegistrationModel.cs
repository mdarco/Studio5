using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class TrainingMemberPresenceRegistrationModel
    {
        public int TrainingID { get; set; }
        public int MemberID { get; set; }
        public string MemberName { get; set; }
        public bool? IsPresent { get; set; }
        public bool? IsOnline { get; set; }
        public bool? AbsenceJustified { get; set; }
        public string AbsenceNote { get; set; }
        public bool? ForceDeleteAbsenceNote { get; set; }
    }
}
