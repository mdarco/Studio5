using DF.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.BL
{
    public static class Members
    {
        #region Documents

        public static void InsertDocument(MemberDocumentModel model)
        {
            DocumentModel docModel = Documents.ConvertMemberDocumentModelToDocModel(model);

            // first save file to file system
            File.WriteAllBytes(docModel.DocumentPhysicalPath, docModel.Bytes);

            try
            {
                // then insert doc data into DB
                DB.Members.InsertDocument(model.MemberID, docModel);
            }
            catch (Exception ex)
            {
                File.Delete(docModel.DocumentPhysicalPath);

                throw ex;
            }
        }

        public static void DeleteDocument(int documentID)
        {
            var docModel = DB.Members.GetIndividualDocument(documentID);
            if (docModel != null)
            {
                string docPath = string.Format("{0}{1}.tim", Documents.GetPhysicalPath(), docModel.DocumentPath);

                DB.Members.DeleteDocument(documentID);
                File.Delete(docPath);
            }
        }

        #endregion

        #region Payments

        public static void AddMemberPayment(int memberID, MemberPaymentModel model)
        {
            // get payment info
            var paymentInfo = DB.Payments.GetPayment(model.ID);

            // check discount
            if (model.DiscountPercentage.HasValue)
            {
                model.DiscountAmount = paymentInfo.Amount * (1 - ((decimal)model.DiscountPercentage / 100));
            }

            // generate installments
            model.Installments = new List<InstallmentModel>();

            if (paymentInfo.Type.ToUpper() == "ONE-TIME" || paymentInfo.Type.ToUpper() == "MONTHLY")
            {
                if (paymentInfo.NumberOfInstallments == 1)
                {
                    /* 
                     * FULL ONE-TIME PAYMENT - treated as one-time payment with only one installment
                     * 
                     * MONTHLY PAYMENTS - treated as full one-time payments
                     * Recurring can go indefinitely if there is no stop date
                     * Service agent is in charge of creating new monthly payments at the beginning of each month
                     * 
                     */

                    decimal installmentAmount = model.DiscountAmount.HasValue ? (decimal)model.DiscountAmount : (decimal)paymentInfo.Amount;
                    if (model.Companions != null && model.Companions.Count() > 0)
                    {
                        foreach (var c in model.Companions)
                        {
                            installmentAmount += (decimal)paymentInfo.AmountForCompanion;
                        }
                    }

                    DateTime installmentDate = (DateTime)paymentInfo.DueDate;

                    var oneTimePayment = new InstallmentModel()
                    {
                        InstallmentDate = installmentDate,
                        // InstallmentDate = paymentInfo.DueDate,
                        Amount = installmentAmount,
                        IsPaid = false
                    };

                    model.Installments.Add(oneTimePayment);
                }

                if (paymentInfo.NumberOfInstallments > 1)
                {
                    /*
                     * ONE-TIME PAYMENT WITH INSTALLMENTS
                     */

                    List<decimal> installmentAmounts = new List<decimal>();
                    if (!string.IsNullOrEmpty(paymentInfo.InstallmentAmounts))
                    {
                        if (paymentInfo.InstallmentAmounts.EndsWith(";"))
                        {
                            paymentInfo.InstallmentAmounts = paymentInfo.InstallmentAmounts.Substring(0, paymentInfo.InstallmentAmounts.Length - 1);
                        }

                        installmentAmounts = paymentInfo.InstallmentAmounts.Split(';').Select(x => decimal.Parse(x)).ToList();
                    }
                    else
                    {
                        for (int xx = 1; xx <= paymentInfo.NumberOfInstallments; xx++)
                        {
                            installmentAmounts.Add((decimal)paymentInfo.Amount / (int)paymentInfo.NumberOfInstallments);
                        }
                    }

                    List<decimal> installmentAmountsForCompanion = new List<decimal>();
                    if (model.Companions != null && model.Companions.Count() > 0)
                    {
                        if (!string.IsNullOrEmpty(paymentInfo.InstallmentAmountsForCompanion))
                        {
                            if (paymentInfo.InstallmentAmountsForCompanion.EndsWith(";"))
                            {
                                paymentInfo.InstallmentAmountsForCompanion = paymentInfo.InstallmentAmountsForCompanion.Substring(0, paymentInfo.InstallmentAmountsForCompanion.Length - 1);
                            }

                            installmentAmountsForCompanion = paymentInfo.InstallmentAmountsForCompanion.Split(';').Select(x => decimal.Parse(x)).ToList();
                        }
                        else
                        {
                            for (int xx = 1; xx <= paymentInfo.NumberOfInstallments; xx++)
                            {
                                installmentAmountsForCompanion.Add((decimal)paymentInfo.AmountForCompanion / (int)paymentInfo.NumberOfInstallments);
                            }
                        }
                    }

                    decimal totalAmount = (decimal)paymentInfo.Amount;
                    if (model.DiscountPercentage.HasValue)
                    {
                        totalAmount = totalAmount * (1 - ((decimal)model.DiscountPercentage / 100));
                        installmentAmounts = installmentAmounts.Select(x => x * (1 - ((decimal)model.DiscountPercentage / 100))).ToList();
                    }

                    for (int i = 0; i < paymentInfo.NumberOfInstallments; i++)
                    {
                        DateTime installmentDate = (i == 0) ? (DateTime)paymentInfo.DueDate : ((DateTime)paymentInfo.DueDate).AddMonths(i);

                        decimal installmentAmount = installmentAmounts.ElementAt(i);

                        if (model.Companions != null && model.Companions.Count() > 0)
                        {
                            foreach (var c in model.Companions)
                            {
                                installmentAmount += installmentAmountsForCompanion.ElementAt(i);
                            }
                        }

                        var installment = new InstallmentModel()
                        {
                            InstallmentDate = installmentDate,
                            Amount = installmentAmount,
                            IsPaid = false
                        };

                        model.Installments.Add(installment);
                    }
                }
            }

            DB.Members.AddMemberPayment(memberID, model);
        }

        #endregion
    }
}
