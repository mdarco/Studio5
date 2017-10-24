using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class DanceGroups
    {
        public static List<LookupModel> GetLookup()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DanceGroups
                        .Select(x =>
                            new LookupModel()
                            {
                                ID = x.DanceGroupID,
                                Name = x.DanceGroupName
                            }
                        )
                        .OrderBy(lkp => lkp.Name)
                        .ToList();
            }
        }
    }
}
