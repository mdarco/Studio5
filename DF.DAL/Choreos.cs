using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Choreos
    {
        public static List<LookupModel> GetLookup()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Choreographies
                        .Select(x =>
                            new LookupModel()
                            {
                                ID = x.ChoreographyID,
                                Name = x.ChoreographyName
                            }
                        )
                        .OrderBy(lkp => lkp.Name)
                        .ToList();
            }
        }
    }
}
