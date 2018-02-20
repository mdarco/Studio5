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
    }
}
