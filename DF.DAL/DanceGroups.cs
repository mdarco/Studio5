using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Data.Entity;
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
                        .Include(t => t.Lookup_AgeCategories)
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

        public static List<DanceGroupModel> GetAllDanceGroups()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DanceGroups
                        .Include(t => t.Lookup_AgeCategories)
                        .Select(x =>
                            new DanceGroupModel()
                            {
                                DanceGroupID = x.DanceGroupID,
                                DanceGroupName = x.DanceGroupName
                            }
                        )
                        .OrderBy(lkp => lkp.DanceGroupName)
                        .ToList();
            }
        }

        public static ApiTableResponseModel<DanceGroupModel> GetDanceGroups(DanceGroupModel filter)
        {
            ApiTableResponseModel<DanceGroupModel> response = new ApiTableResponseModel<DanceGroupModel>();

            using (var ctx = new DFAppEntities())
            {
                var q = ctx.DanceGroups
                                .Include(t => t.Lookup_AgeCategories)
                                .AsQueryable();

                if (!string.IsNullOrEmpty(filter.DanceGroupName))
                {
                    q = q.Where(x => x.DanceGroupName.ToLower().Contains(filter.DanceGroupName.ToLower()));
                }

                if (string.IsNullOrEmpty(filter.OrderByClause))
                {
                    // default order
                    filter.OrderByClause = "DanceGroupName";
                }

                if (filter.PageNo < 1)
                {
                    filter.PageNo = 1;
                }

                if (filter.RecordsPerPage < 1)
                {
                    // unlimited
                    filter.RecordsPerPage = 1000000;
                }

                response.Total = q.Count();

                var Data =
                    q.ToList()
                    .Select(x =>
                        new DanceGroupModel()
                        {
                            DanceGroupID = x.DanceGroupID,
                            DanceGroupName = x.DanceGroupName,
                            DanceGroupDesc = x.DanceGroupDesc,
                            AgeCategoryID = x.AgeCategoryID,
                            AgeCategory = (x.Lookup_AgeCategories != null) ? x.Lookup_AgeCategories.Name : string.Empty
                        }
                    )
                    .OrderBy(filter.OrderByClause)
                    .Skip((filter.PageNo - 1) * filter.RecordsPerPage)
                    .Take(filter.RecordsPerPage);

                response.Data = Data;
            }

            return response;
        }

        public static DanceGroupModel GetDanceGroup(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DanceGroups.Include(t => t.Lookup_AgeCategories).Where(dg => dg.DanceGroupID == id)
                        .Select(x =>
                            new DanceGroupModel()
                            {
                                DanceGroupID = x.DanceGroupID,
                                DanceGroupName = x.DanceGroupName,
                                DanceGroupDesc = x.DanceGroupDesc,
                                AgeCategoryID = x.AgeCategoryID,
                                AgeCategory = (x.Lookup_AgeCategories != null) ? x.Lookup_AgeCategories.Name : string.Empty
                            }
                        )
                        .FirstOrDefault();
            }
        }

        public static DanceGroupModel CreateDanceGroup(DanceGroupModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.DanceGroups existing = ctx.DanceGroups.FirstOrDefault(x => x.DanceGroupName.ToLower() == model.DanceGroupName.ToLower());

                if (existing != null)
                {
                    throw new Exception("Grupa sa datim imenom već postoji.");
                }

                DBModel.DanceGroups dg = new DBModel.DanceGroups();
                dg.DanceGroupName = model.DanceGroupName;
                dg.DanceGroupDesc = model.DanceGroupDesc;
                dg.AgeCategoryID = model.AgeCategoryID;

                ctx.DanceGroups.Add(dg);
                ctx.SaveChanges();

                model.DanceGroupID = dg.DanceGroupID;
                return model;
            }
        }

        public static void UpdateDanceGroup(DanceGroupModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.DanceGroups t = ctx.DanceGroups.FirstOrDefault(x => x.DanceGroupID == model.DanceGroupID);
                if (t != null)
                {
                    if (!string.IsNullOrEmpty(model.DanceGroupName))
                    {
                        t.DanceGroupName = model.DanceGroupName;
                    }

                    if (!string.IsNullOrEmpty(model.DanceGroupDesc))
                    {
                        t.DanceGroupDesc = model.DanceGroupDesc;
                    }

                    if (model.AgeCategoryID.HasValue)
                    {
                        t.AgeCategoryID = model.AgeCategoryID;
                    }

                    ctx.SaveChanges();
                }
            }


        }

        public static void DeleteDanceGroup(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.DanceGroups t = ctx.DanceGroups.FirstOrDefault(x => x.DanceGroupID == id);
                if (t != null)
                {
                    ctx.Entry(t).Collection(x => x.DanceGroupChoreographies).Load();
                    ctx.Entry(t).Collection(x => x.DanceGroupMembers).Load();
                    ctx.Entry(t).Collection(x => x.DanceGroupStaff).Load();
                    ctx.Entry(t).Collection(x => x.DanceSelectionDanceGroups).Load();
                    ctx.Entry(t).Collection(x => x.DanceGroupLocations).Load();

                    for(int i = t.DanceGroupChoreographies.Count() - 1; i >= 0; i--)
                    {
                        ctx.DanceGroupChoreographies.Remove(t.DanceGroupChoreographies.ElementAt(i));
                    }

                    for (int i = t.DanceGroupMembers.Count() - 1; i >= 0; i--)
                    {
                        ctx.DanceGroupMembers.Remove(t.DanceGroupMembers.ElementAt(i));
                    }

                    for (int i = t.DanceGroupStaff.Count() - 1; i >= 0; i--)
                    {
                        ctx.DanceGroupStaff.Remove(t.DanceGroupStaff.ElementAt(i));
                    }

                    for (int i = t.DanceSelectionDanceGroups.Count() - 1; i >= 0; i--)
                    {
                        ctx.DanceSelectionDanceGroups.Remove(t.DanceSelectionDanceGroups.ElementAt(i));
                    }

                    for (int i = t.DanceGroupLocations.Count() - 1; i >= 0; i--)
                    {
                        ctx.DanceGroupLocations.Remove(t.DanceGroupLocations.ElementAt(i));
                    }

                    ctx.DanceGroups.Remove(t);
                    ctx.SaveChanges();
                }
            }
        }
    }
}
