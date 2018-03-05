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
                                .FirstOrDefault(x => x.ID == id);

                if (p != null)
                {
                    if (p.MemberPayments != null && p.MemberPayments.Count() > 0)
                    {
                        throw new Exception("Placanje je vezano za clanove i ne moze se obrisati.");
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

        #endregion
    }
}
