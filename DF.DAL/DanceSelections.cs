using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class DanceSelections
    {
        public static List<LookupModel> GetLookup()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DanceSelections
                        .Select(x =>
                            new LookupModel()
                            {
                                ID = x.DanceSelectionID,
                                Name = x.DanceSelectionName
                            }
                        )
                        .OrderBy(lkp => lkp.Name)
                        .ToList();
            }
        }
    }
}
