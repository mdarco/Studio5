using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Lookups
    {
        public static List<LookupModel> GetAgeCategories()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Lookup_AgeCategories
                            .Select(x =>
                                new LookupModel()
                                {
                                    ID = x.ID,
                                    Name = x.Name
                                }
                            )
                            .OrderBy(ac => ac.Name)
                            .ToList();
            }
        }

        public static List<LookupModel> GetLocations()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Locations
                            .Select(x =>
                                new LookupModel()
                                {
                                    ID = x.LocationID,
                                    Name = x.LocationName,
                                    Desc = x.LocationDesc,
                                    Metadata = x.LocationAddress
                                }
                            )
                            .OrderBy(ac => ac.Name)
                            .ToList();
            }
        }

        public static List<LookupModel> GetUsers()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Users
                            .Where(u => u.IsActive)
                            .Select(x =>
                                new LookupModel()
                                {
                                    ID = x.UserID,
                                    Name = x.FirstName + " " + x.LastName
                                }
                            )
                            .OrderBy(ac => ac.Name)
                            .ToList();
            }
        }
    }
}
