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
            DateTime? startDate = new DateTime(2018, 7, 1);
            DateTime? endDate = new DateTime(2018, 7, 31);

            List<ReportInstallment> installments = DB.Reports.GetUnpaidInstallmentsByPeriod(startDate, endDate);
            Assert.IsTrue(installments.Count == 1);
        }
    }
}
