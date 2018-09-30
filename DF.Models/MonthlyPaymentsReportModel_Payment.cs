using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MonthlyPaymentsReportModel_Payment
    {
        public string Name { get; set; }
        public List<ReportInstallment> Installments { get; set; }
    }
}
