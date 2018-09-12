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
    }
}
