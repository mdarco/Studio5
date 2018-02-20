using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class PaymentModel
    {
        public int? ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Currency { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? StopDate { get; set; }
        public int? NumberOfInstallments { get; set; }
        public string InstallmentAmounts { get; set; }
        public decimal? AmountForCompanion { get; set; }
        public string InstallmentAmountsForCompanion { get; set; }
        public bool Active { get; set; }
        public Nullable<int> EventID { get; set; }
        public Nullable<int> CostumeID { get; set; }
        public Nullable<int> OutfitID { get; set; }
    }
}
