using System;
using System.Collections.Generic;
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

        [TestMethod]
        public void AddMemberPayment_FullOneTime()
        {
            const int MEMBER_ID = 1;
            const int PAYMENT_ID = 1;

            Models.MemberPaymentModel model = new Models.MemberPaymentModel()
            {
                MemberID = MEMBER_ID,
                ID = PAYMENT_ID,

                Companions =
                    new List<Models.CompanionModel>()
                    {
                        new Models.CompanionModel() { Name = "Pratilac-1", Phone = "111-222", Email = "fake@dummy.com" },
                        new Models.CompanionModel() { Name = "Pratilac-2", Phone = "333-444", Email = "dummy@dummy.com" }
                    }
            };

            BL.Members.AddMemberPayment(MEMBER_ID, model);
        }

        [TestMethod]
        public void AddMemberPayment_OneTimeWithInstallments()
        {
            const int MEMBER_ID = 3;
            const int PAYMENT_ID = 1;

            Models.MemberPaymentModel model = new Models.MemberPaymentModel()
            {
                MemberID = MEMBER_ID,
                ID = PAYMENT_ID,
                DiscountPercentage = 10//,

                //Companions =
                //    new List<Models.CompanionModel>()
                //    {
                //        new Models.CompanionModel() { Name = "Pratilac-3", Phone = "555-555", Email = "john.doe@dummy.com" },
                //    }
            };

            BL.Members.AddMemberPayment(MEMBER_ID, model);
        }

        [TestMethod]
        public void AddMemberPayment_Monthly()
        {
            const int MEMBER_ID = 3;
            const int PAYMENT_ID = 3;

            Models.MemberPaymentModel model = new Models.MemberPaymentModel()
            {
                MemberID = MEMBER_ID,
                ID = PAYMENT_ID
            };

            BL.Members.AddMemberPayment(MEMBER_ID, model);
        }

        [TestMethod]
        public void CreateNewMonthlyInstallments()
        {
            DB.Members.CreateNewMonthlyInstallments();
        }
    }
}
