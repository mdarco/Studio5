using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Globalization;

namespace DF.DB
{
    public static class Trainings
    {
        public static ApiTableResponseModel<TrainingModel> GetTrainingsFiltered(TrainingFilter filter)
        {
            ApiTableResponseModel<TrainingModel> response = new ApiTableResponseModel<TrainingModel>();

            using (var ctx = new DFAppEntities())
            {
                var q = ctx.Trainings
                            .Include(t => t.Locations)
                            .Include(t => t.DanceGroups)
                            .Include(t => t.DanceSelections)
                            .Include(t => t.Users)
                            .Include("TrainingMemberPresenceRegistrations.Members")
                            .AsQueryable();

                if (filter.TrainingDate.HasValue)
                {
                    q = q.Where(x => x.TrainingDate == filter.TrainingDate.Value);
                }

                if (filter.TrainingDanceGroupID.HasValue)
                {
                    q = q.Where(x => x.TrainingDanceGroupID == filter.TrainingDanceGroupID.Value);
                }

                if (filter.TrainingLocationID.HasValue)
                {
                    q = q.Where(x => x.TrainingLocationID == filter.TrainingLocationID.Value);
                }

                if (filter.TrainerUserID.HasValue)
                {
                    q = q.Where(x => x.TrainerUserID == filter.TrainerUserID.Value);
                }

                if (!string.IsNullOrEmpty(filter.WeekDay))
                {
                    q = q.Where(x => x.WeekDay.ToUpper() == filter.WeekDay.ToUpper());
                }

                if (string.IsNullOrEmpty(filter.OrderByClause))
                {
                    // default order
                    filter.OrderByClause = "TrainingDate";
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
                        new TrainingModel()
                        {
                            TrainingID = x.TrainingID,
                            TrainingDate = x.TrainingDate,
                            TrainingLocationID = x.TrainingLocationID,
                            TrainingLocationName = x.Locations.LocationName,
                            TrainingDanceGroupID = x.TrainingDanceGroupID,
                            TrainingDanceGroupName = x.DanceGroups.DanceGroupName,
                            WeekDay = x.WeekDay,
                            StartTime = (TimeSpan)x.StartTime,
                            EndTime = (TimeSpan)x.EndTime,
                            TrainerUserID = x.TrainerUserID,
                            TrainerUserName = (x.Users != null) ? (x.Users.FirstName + " " + x.Users.LastName) : string.Empty,

                            TrainingMemberPresenceRegistrations = x.TrainingMemberPresenceRegistrations.Select(r =>
                                new TrainingMemberPresenceRegistrationModel()
                                {
                                    TrainingID = r.TrainingID,
                                    MemberID = r.MemberID,
                                    MemberName = r.Members.FirstName + " " + r.Members.LastName,
                                    IsPresent = r.IsPresent,
                                    AbsenceJustified = r.AbsenceJustified,
                                    AbsenceNote = r.AbsenceNote
                                }
                            )
                            .OrderBy(mp => mp.MemberName)
                        }
                    )
                    .OrderBy(filter.OrderByClause)
                    .Skip((filter.PageNo - 1) * filter.RecordsPerPage)
                    .Take(filter.RecordsPerPage);

                response.Data = Data;
            }

            return response;
        }

        public static TrainingModel CreateTraining(TrainingModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.Trainings existing = ctx.Trainings
                                                .FirstOrDefault(x => 
                                                    x.TrainingDate == model.TrainingDate && 
                                                    x.TrainingLocationID == model.TrainingLocationID &&
                                                    x.TrainingDanceGroupID == model.TrainingDanceGroupID &&
                                                    x.StartTime == model.StartTime
                                                );

                if (existing != null)
                {
                    throw new Exception("Trening sa zadatim datumom, lokacijom, grupom i početnim vremenom već postoji.");
                }

                DBModel.Trainings t = new DBModel.Trainings
                {
                    TrainingDate = model.TrainingDate,
                    TrainingLocationID = model.TrainingLocationID,
                    TrainingDanceGroupID = model.TrainingDanceGroupID,
                    WeekDay = model.TrainingDate.ToString("dddd", new CultureInfo("sr-Latn-RS")),
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    TrainerUserID = model.TrainerUserID
                };

                // training member presence registrations
                var groupMembers = ctx.DanceGroupMembers
                                        .Include(tbl => tbl.Members)
                                        .Where(x => x.DanceGroupID == model.TrainingDanceGroupID && x.Members.IsActive);

                foreach (var groupMember in groupMembers)
                {
                    TrainingMemberPresenceRegistrations r = new TrainingMemberPresenceRegistrations
                    {
                        TrainingID = t.TrainingID,
                        MemberID = groupMember.MemberID,
                        IsPresent = true,
                        AbsenceJustified = true
                    };

                    ctx.TrainingMemberPresenceRegistrations.Add(r);
                }

                ctx.Trainings.Add(t);
                ctx.SaveChanges();

                model.WeekDay = t.WeekDay;
                model.TrainingID = t.TrainingID;
                return model;
            }
        }

        public static void DeleteTraining(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.Trainings t = ctx.Trainings.FirstOrDefault(x => x.TrainingID == id);
                if (t != null)
                {
                    ctx.Entry(t).Collection(x => x.TrainingMemberPresenceRegistrations).Load();

                    for (int i = t.TrainingMemberPresenceRegistrations.Count() - 1; i >= 0; i--)
                    {
                        ctx.TrainingMemberPresenceRegistrations.Remove(t.TrainingMemberPresenceRegistrations.ElementAt(i));
                    }

                    ctx.Trainings.Remove(t);
                    ctx.SaveChanges();
                }
            }
        }

        public static IEnumerable<TrainingMemberPresenceRegistrationModel> GetTrainingMemberPresenceRegistrations(int trainingID)
        {
            using (var ctx = new DFAppEntities())
            {
                var training = ctx.Trainings.Include("TrainingMemberPresenceRegistrations.Members").FirstOrDefault(t => t.TrainingID == trainingID);
                if (training != null)
                {
                    return training.TrainingMemberPresenceRegistrations.Select(r =>
                        new TrainingMemberPresenceRegistrationModel()
                        {
                            TrainingID = r.TrainingID,
                            MemberID = r.MemberID,
                            MemberName = r.Members.FirstName + " " + r.Members.LastName,
                            IsPresent = r.IsPresent,
                            AbsenceJustified = r.AbsenceJustified,
                            AbsenceNote = r.AbsenceNote
                        }
                    )
                    .OrderBy(x => x.MemberName);
                }

                return null;
            }
        }

        public static void UpdateTrainingMemberPresenceRegistration(TrainingMemberPresenceRegistrationModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var reg = ctx.TrainingMemberPresenceRegistrations.Include(t => t.Members).FirstOrDefault(r => r.TrainingID == model.TrainingID && r.MemberID == model.MemberID);
                if (reg != null)
                {
                    if (model.IsPresent.HasValue)
                    {
                        reg.IsPresent = model.IsPresent.Value;

                        if (reg.IsPresent)
                        {
                            reg.AbsenceJustified = true;
                            reg.AbsenceNote = null;
                        }
                    }

                    if (!reg.IsPresent && model.AbsenceJustified.HasValue)
                    {
                        reg.AbsenceJustified = model.AbsenceJustified.Value;
                    }

                    if (!reg.IsPresent)
                    {
                        reg.AbsenceNote = model.AbsenceNote;
                    }

                    ctx.SaveChanges();
                }
            }
        }
    }
}
