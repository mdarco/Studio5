using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Payments
    {
        public static List<PaymentModel> GetPaymentsFiltered(PaymentFilter filter)
        {
            using (var ctx = new DFAppEntities())
            {
                if (filter != null)
                {
                    var q = ctx.Payments.AsQueryable();

                    if (!string.IsNullOrEmpty(filter.Name))
                    {
                        q = q.Where(x => x.Name.ToLower().Contains(filter.Name.ToLower()));
                    }

                    if (filter.ExcludeID != null && filter.ExcludeID.Count() > 0)
                    {
                        q = q.Where(x => !filter.ExcludeID.Contains(x.ID));
                    }

                    if (filter.IsActive.HasValue)
                    {
                        q = q.Where(x => x.Active == filter.IsActive);
                    }

                    return q.Select(x =>
                                new PaymentModel()
                                {
                                    ID = x.ID,
                                    Name = x.Name,
                                    Description = x.Description,
                                    Type = x.Type,
                                    Currency = x.Currency,
                                    Amount = x.Amount,
                                    DueDate = x.DueDate,
                                    StopDate = x.StopDate,
                                    NumberOfInstallments = x.NumberOfInstallments,
                                    InstallmentAmounts = x.InstallmentAmounts,
                                    AmountForCompanion = x.AmountForCompanion,
                                    InstallmentAmountsForCompanion = x.InstallmentAmountsForCompanion,
                                    Active = x.Active,
                                    EventID = x.EventID,
                                    CostumeID = x.CostumeID,
                                    OutfitID = x.OutfitID
                                }
                           )
                           .OrderBy(x => x.Name)
                           .ToList();
                }

                return null;
            }
        }

        public static PaymentModel GetPayment(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var p = ctx.Payments.FirstOrDefault(x => x.ID == id);
                if (p != null)
                {
                    return
                        new PaymentModel()
                        {
                            ID = p.ID,
                            Name = p.Name,
                            Description = p.Description,
                            Type = p.Type,
                            Currency = p.Currency,
                            Amount = p.Amount,
                            DueDate = p.DueDate,
                            StopDate = p.StopDate,
                            NumberOfInstallments = p.NumberOfInstallments,
                            InstallmentAmounts = p.InstallmentAmounts,
                            AmountForCompanion = p.AmountForCompanion,
                            InstallmentAmountsForCompanion = p.InstallmentAmountsForCompanion,
                            Active = p.Active,
                            EventID = p.EventID,
                            CostumeID = p.CostumeID,
                            OutfitID = p.OutfitID
                        };
                }

                return null;
            }
        }

        public static void AddPayment(PaymentModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.Payments.FirstOrDefault(x => x.Name.ToLower() == model.Name.ToLower());
                if (existing != null)
                {
                    throw new Exception("error_payments_name_exists");
                }

                var p = new DBModel.Payments()
                {
                    Name = model.Name,
                    Description = model.Description,
                    Type = model.Type,
                    Currency = model.Currency,
                    Amount = model.Amount,
                    DueDate = (DateTime)model.DueDate,
                    StopDate = model.StopDate,
                    NumberOfInstallments = model.NumberOfInstallments,
                    InstallmentAmounts = model.InstallmentAmounts,
                    AmountForCompanion = model.AmountForCompanion,
                    InstallmentAmountsForCompanion = model.InstallmentAmountsForCompanion,
                    Active = true,
                    EventID = model.EventID,
                    CostumeID = model.CostumeID,
                    OutfitID = model.OutfitID
                };

                ctx.Payments.Add(p);
                ctx.SaveChanges();
            }
        }

        public static void DeletePayment(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var p = ctx.Payments
                                .Include(t => t.MemberPayments)
                                .Include(t => t.MemberPaymentInstallments)
                                .Include(t => t.MemberPaymentsForCompanions)
                                .FirstOrDefault(x => x.ID == id);

                if (p != null)
                {
                    for (int i = p.MemberPaymentsForCompanions.Count() - 1; i >= 0; i--)
                    {
                        ctx.MemberPaymentsForCompanions.Remove(p.MemberPaymentsForCompanions.ElementAt(i));
                    }

                    for (int j = p.MemberPaymentInstallments.Count() - 1; j >= 0; j--)
                    {
                        ctx.MemberPaymentInstallments.Remove(p.MemberPaymentInstallments.ElementAt(j));
                    }

                    for (int k = p.MemberPayments.Count() - 1; k >= 0; k--)
                    {
                        ctx.MemberPayments.Remove(p.MemberPayments.ElementAt(k));
                    }

                    ctx.Payments.Remove(p);
                    ctx.SaveChanges();
                }
            }
        }

        #region Installments

        public static List<GetLatestMonthlyInstallments_Result> GetLatestMonthlyInstallments()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.GetLatestMonthlyInstallments().ToList();
            }
        }

        // this is executed by an agent every first day of the month
        public static void CreateNewMonthlyInstallments()
        {
            var latestMonthlyInstallments = Payments.GetLatestMonthlyInstallments();
            if (latestMonthlyInstallments != null && latestMonthlyInstallments.Count() > 0)
            {
                using (var ctx = new DFAppEntities())
                {
                    foreach (var monthlyInstallment in latestMonthlyInstallments)
                    {
                        if (DateTime.Now.Year == monthlyInstallment.InstallmentDate.Year)
                        {
                            int diff = DateTime.Now.Month - monthlyInstallment.InstallmentDate.Month;
                            if (diff == 0) diff++;
                            if (diff < 0) continue;

                            MemberPaymentInstallments newMonthlyInstallment = new MemberPaymentInstallments()
                            {
                                MemberID = monthlyInstallment.MemberID,
                                PaymentID = monthlyInstallment.PaymentID,
                                InstallmentDate = monthlyInstallment.InstallmentDate.AddMonths(diff),
                                Amount = monthlyInstallment.Amount,
                                IsCanceled = false,
                                IsPaid = false
                            };

                            ctx.MemberPaymentInstallments.Add(newMonthlyInstallment);
                        }
                    }

                    ctx.SaveChanges();
                }
            }
        }

        #endregion
    }
}
