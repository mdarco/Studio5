using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Events
    {
        public static List<LookupModel> GetLookup()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Events
                        .Select(x =>
                            new LookupModel()
                            {
                                ID = x.EventID,
                                Name = x.EventName
                            }
                        )
                        .OrderBy(lkp => lkp.Name)
                        .ToList();
            }
        }
    }
}
