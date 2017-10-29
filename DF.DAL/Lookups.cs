﻿using DF.DB.DBModel;
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
    }
}