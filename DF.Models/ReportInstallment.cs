using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class ReportInstallment
    {
        public DateTime? InstallmentDate { get; set; }
        public decimal? Amount { get; set; }
        public string Note { get; set; }
        public int? MemberID { get; set; }
        public int? PaymentID { get; set; }
        public string PaymentName { get; set; }
        public string PaymentDescription { get; set; }
        public string Currency { get; set; }
        public string PaymentType { get; set; }
        public decimal? PaymentAmount { get; set; }
        public int? NumberOfInstallments { get; set; }
        public string MemberFullName { get; set; }
        public bool? MemberActive { get; set; }
        public string Email { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Phone3 { get; set; }
    }
}
