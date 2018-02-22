using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DF.Test
{
    [TestClass]
    public class Members
    {
        [TestMethod]
        public void AddPayment_FullOneTime()
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

        [TestMethod]
        public void AddPayment_OneTimeWithInstallments()
        {
            DF.Models.PaymentModel model = new Models.PaymentModel()
            {
                Active = true,
                Amount = 5000,
                AmountForCompanion = 3000,
                Currency = "RSD",
                Description = "One-time payment with installments",
                DueDate = new DateTime(2018, 2, 23),
                InstallmentAmounts = "2000;1000;1000;500;500",
                InstallmentAmountsForCompanion = "1000;1000;400;300;300",
                Name = "One-time-with-installments",
                NumberOfInstallments = 5,
                Type = "ONE-TIME"
            };

            DB.Payments.AddPayment(model);
        }

        [TestMethod]
        public void AddPayment_Monthly()
        {
            DF.Models.PaymentModel model = new Models.PaymentModel()
            {
                Active = true,
                Amount = 2500,
                Currency = "RSD",
                Description = "Monthly payment",
                DueDate = new DateTime(2018, 2, 23),
                Name = "Monthly payment",
                NumberOfInstallments = 1,
                Type = "MONTHLY"
            };

            DB.Payments.AddPayment(model);
        }
    }
}
