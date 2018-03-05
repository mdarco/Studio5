using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DF.Test
{
    [TestClass]
    public class Payments
    {
        [TestMethod]
        public void GetLatestMonthlyInstallments()
        {
            var latestMonthlyInstallments = DB.Payments.GetLatestMonthlyInstallments();
        }
    }
}
