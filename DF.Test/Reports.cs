using System;
using System.Collections.Generic;
using DF.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DF.Test
{
    [TestClass]
    public class Reports
    {
        [TestMethod]
        public void GetUnpaidInstallmentsByDate()
        {
            List<ReportInstallment> installments = DB.Reports.GetUnpaidInstallmentsByPeriod(null, null);
        }
    }
}
