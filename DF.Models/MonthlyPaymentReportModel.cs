using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MonthlyPaymentsReportModel
    {
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public string ContactPhone { get; set; }

        public string Documents { get; set; }
        public List<MonthlyPaymentsReportModel_Document> DeserializedDocuments { get; set; }

        public string Payments { get; set; }
        public List<MonthlyPaymentsReportModel_Payment> DeserializedPayments { get; set; }
    }
}
