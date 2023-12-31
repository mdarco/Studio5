﻿using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Data.Entity;
using System.Globalization;
using System.Data.SqlClient;
using Dapper;

namespace DF.DB
{
    public static class Trainings
    {
        private static readonly string connectionString = DALHelper.GetSqlConnectionStringFromEF();

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
                            // .Include("TrainingMemberPresenceRegistrations.Members")
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
                    filter.OrderByClause = "TrainingDate desc";
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
                            Note = x.Note//,

                            //TrainingMemberPresenceRegistrations = x.TrainingMemberPresenceRegistrations.Select(r =>
                            //    new TrainingMemberPresenceRegistrationModel()
                            //    {
                            //        TrainingID = r.TrainingID,
                            //        MemberID = r.MemberID,
                            //        MemberName = r.Members.FirstName + " " + r.Members.LastName,
                            //        IsPresent = r.IsPresent,
                            //        AbsenceJustified = r.AbsenceJustified,
                            //        AbsenceNote = r.AbsenceNote
                            //    }
                            //)
                            //.OrderBy(mp => mp.MemberName)
                        }
                    )
                    .OrderBy(filter.OrderByClause)
                    .Skip((filter.PageNo - 1) * filter.RecordsPerPage)
                    .Take(filter.RecordsPerPage);

                response.Data = Data;
            }

            return response;
        }

        public static TrainingModel GetTraining(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var training = ctx.Trainings
                                .Include(t => t.Locations)
                                .Include(t => t.DanceGroups)
                                .Include(t => t.DanceSelections)
                                .Include(t => t.Users)
                                .FirstOrDefault(x => x.TrainingID == id);

                if (training != null)
                {
                    return new TrainingModel()
                    {
                        TrainingID = training.TrainingID,
                        TrainingDate = training.TrainingDate,
                        TrainingLocationID = training.TrainingLocationID,
                        TrainingLocationName = training.Locations.LocationName,
                        TrainingDanceGroupID = training.TrainingDanceGroupID,
                        TrainingDanceGroupName = training.DanceGroups.DanceGroupName,
                        WeekDay = training.WeekDay,
                        StartTime = (TimeSpan)training.StartTime,
                        EndTime = (TimeSpan)training.EndTime,
                        TrainerUserID = training.TrainerUserID,
                        TrainerUserName = (training.Users != null) ? (training.Users.FirstName + " " + training.Users.LastName) : string.Empty,
                        Note = training.Note
                    };
                }

                return null;
            }
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
                    TrainerUserID = model.TrainerUserID,
                    Note = model.Note
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

        public static TrainingModel CreateTrainingFromTrainingSchedule(TrainingModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var schedule = ctx.TrainingSchedules.FirstOrDefault(x => x.ID == model.TrainingScheduleID);
                if (schedule == null)
                {
                    throw new Exception("Raspored treninga ne postoji.");
                }

                // copy training props from training schedule
                model.TrainingLocationID = schedule.TrainingLocationID;
                model.WeekDay = schedule.WeekDay;
                model.StartTime = schedule.StartTime;
                model.EndTime = schedule.EndTime;

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
                    TrainerUserID = model.TrainerUserID,
                    Note = model.Note
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

        public static void EditTraining(TrainingModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                DBModel.Trainings existing = ctx.Trainings.FirstOrDefault(x =>x.TrainingID == model.TrainingID);

                if (existing != null)
                {
                    existing.Note = model.Note;

                    ctx.SaveChanges();
                }
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

        #region Training schedules

        // returns only active schedules
        public static List<TrainingScheduleModel> GetTrainingSchedules()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.TrainingSchedules.Include(t => t.Locations).Where(x => x.Active).Select(x =>
                    new TrainingScheduleModel
                    {
                        ID = x.ID,
                        TrainingLocationID = x.TrainingLocationID,
                        TrainingLocationName = x.Locations.LocationName,
                        WeekDay = x.WeekDay,
                        WeekDayOrderNo = (x.WeekDay == "ponedeljak") ? 1 : (x.WeekDay == "utorak") ? 2 : (x.WeekDay == "sreda") ? 3 : (x.WeekDay == "četvrtak") ? 4 : (x.WeekDay == "petak") ? 5 : (x.WeekDay == "subota") ? 6 : (x.WeekDay == "nedelja") ? 7 : 0,
                        StartTime = x.StartTime,
                        EndTime = x.EndTime,
                        Note = x.Note,
                        Active = x.Active
                    }
                )
                .OrderBy(x => x.TrainingLocationName)
                .ThenBy(x => x.WeekDayOrderNo)
                .ThenBy(x => x.StartTime)
                .ToList();
            }
        }

        // returns all schedules
        public static List<TrainingScheduleModel> GetAllTrainingSchedules()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.TrainingSchedules.Include(t => t.Locations).Select(x =>
                    new TrainingScheduleModel
                    {
                        ID = x.ID,
                        TrainingLocationID = x.TrainingLocationID,
                        TrainingLocationName = x.Locations.LocationName,
                        WeekDay = x.WeekDay,
                        WeekDayOrderNo = (x.WeekDay == "ponedeljak") ? 1 : (x.WeekDay == "utorak") ? 2 : (x.WeekDay == "sreda") ? 3 : (x.WeekDay == "četvrtak") ? 4 : (x.WeekDay == "petak") ? 5 : (x.WeekDay == "subota") ? 6 : (x.WeekDay == "nedelja") ? 7 : 0,
                        StartTime = x.StartTime,
                        EndTime = x.EndTime,
                        Note = x.Note,
                        Active = x.Active
                    }
                )
                .OrderBy(x => x.TrainingLocationName)
                .ThenBy(x => x.WeekDayOrderNo)
                .ThenBy(x => x.StartTime)
                .ToList();
            }
        }

        public static int CreateTrainingSchedule(TrainingScheduleModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.TrainingSchedules.FirstOrDefault(x =>
                    x.TrainingLocationID == model.TrainingLocationID &&
                    x.WeekDay == model.WeekDay &&
                    x.StartTime == model.StartTime &&
                    x.EndTime == model.EndTime
                );

                if (existing != null)
                {
                    throw new Exception("error_training_schedule_exists");
                }

                TrainingSchedules s = new TrainingSchedules()
                {
                    TrainingLocationID = model.TrainingLocationID,
                    WeekDay = model.WeekDay,
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    Note = model.Note,
                    Active = model.Active
                };

                ctx.TrainingSchedules.Add(s);
                ctx.SaveChanges();

                return s.ID;
            }
        }

        public static void DeleteTrainingSchedule(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.TrainingSchedules.FirstOrDefault(x => x.ID == id);
                if (existing != null)
                {
                    ctx.TrainingSchedules.Remove(existing);
                    ctx.SaveChanges();
                }
                else
                {
                    throw new Exception("error_training_schedule_not_exist");
                }
            }
        }

        public static void SetActive(TrainingScheduleModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.TrainingSchedules.FirstOrDefault(x => x.ID == model.ID);
                if (existing != null)
                {
                    existing.Active = model.Active;
                    ctx.SaveChanges();
                }
                else
                {
                    throw new Exception("error_training_schedule_not_exist");
                }
            }
        }

        #endregion

        #region Member presence

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
                            IsOnline = r.IsOnline,
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
                        }
                    }

                    if (model.IsOnline.HasValue)
                    {
                        reg.IsOnline = model.IsOnline.Value;
                    }

                    if (!reg.IsPresent && model.AbsenceJustified.HasValue)
                    {
                        reg.AbsenceJustified = model.AbsenceJustified.Value;
                    }

                    if (!reg.IsPresent && !string.IsNullOrEmpty(model.AbsenceNote))
                    {
                        reg.AbsenceNote = model.AbsenceNote;
                    }

                    if (!reg.IsPresent && model.ForceDeleteAbsenceNote.HasValue && model.ForceDeleteAbsenceNote.Value)
                    {
                        reg.AbsenceNote = null;
                    }

                    ctx.SaveChanges();
                }
            }
        }

        public static IEnumerable<dynamic> CreateMemberPresenceSheet(int? danceGroupID, DateTime? startDate, DateTime? endDate)
        {
            string spName = "dbo.MemberPresenceSheet";

            using (var connection = new SqlConnection(connectionString))
            {
                var spParams = new DynamicParameters();
                spParams.Add("@danceGroupID", danceGroupID, dbType: System.Data.DbType.Int32);
                spParams.Add("@startDate", startDate, dbType: System.Data.DbType.DateTime);
                spParams.Add("@endDate", endDate, dbType: System.Data.DbType.DateTime);

                return connection.Query(spName, spParams, commandType: System.Data.CommandType.StoredProcedure).ToList();
            }
        }

        #endregion
    }
}
