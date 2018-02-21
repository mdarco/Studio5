using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class InstallmentModel
    {
        public int ID { get; set; }
        public int MemberID { get; set; }
        public int PaymentID { get; set; }
        public DateTime? InstallmentDate { get; set; }
        public decimal Amount { get; set; }
        public bool? IsPaid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public bool? IsCanceled { get; set; }
        public string Note { get; set; }
    }
}
