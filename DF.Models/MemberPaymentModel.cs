using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MemberPaymentModel
    {
        public int MemberID { get; set; }

        public int? DiscountPercentage { get; set; }
        public decimal? DiscountAmount { get; set; }

        public int ID { get; set; }
        public PaymentModel Payment { get; set; }

        public List<CompanionModel> Companions { get; set; }

        public List<InstallmentModel> Installments { get; set; }
    }
}
