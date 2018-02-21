using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DF.Test
{
    [TestClass]
    public class Members
    {
        [TestMethod]
        public void AddPayment()
        {
            DF.Models.PaymentModel model = new Models.PaymentModel()
            {
                Active = true,
                Amount = 5000,
                AmountForCompanion = 3000,
                Currency = "RSD",
                Description = "Full one-time payment",
                DueDate = new DateTime(2018, 2, 23),
                Name = "One-time",
                NumberOfInstallments = 1,
                Type = "ONE-TIME"
            };

            DB.Payments.AddPayment(model);
        }
    }
}
