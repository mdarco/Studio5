using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/reports")]
    public class ReportsController : ApiController
    {
        [Route("unpaid-installments-by-period")]
        [HttpPost]
        public List<ReportInstallment> GetUnpaidInstallmentsByPeriod(ReportFilter filter)
        {
            return DB.Reports.GetUnpaidInstallmentsByPeriod(filter.StartDate, filter.EndDate);
        }

        [Route("unpaid-installments-by-period-and-dance-group")]
        [HttpPost]
        public List<ReportInstallment> GetUnpaidInstallmentsByPeriodAndDanceGroup(ReportFilter filter)
        {
            return DB.Reports.GetUnpaidInstallmentsByPeriodAndDanceGroup(filter.StartDate, filter.EndDate, filter.DanceGroupID);
        }

        [Route("monthly-payments")]
        [HttpPost]
        public List<MonthlyPaymentsReportModel> GetMonthlyReport(ReportFilter filter)
        {
            return DB.Reports.GetMonthlyPaymentsReport(filter.StartDate, filter.EndDate, filter.DanceGroupID);
        }
    }
}
