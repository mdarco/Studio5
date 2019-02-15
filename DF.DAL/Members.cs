using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Dapper;
using SqlKata;
using SqlKata.Compilers;
using System.Data.SqlClient;

namespace DF.DB
{
    public static class Members
    {
        public static ApiTableResponseModel<MemberModel> GetFilteredMembers_Dapper(MemberFilterModel filter)
        {
            ApiTableResponseModel<MemberModel> response = new ApiTableResponseModel<MemberModel>();

            var q =
                new Query("Members")
                    .LeftJoin("Lookup_AgeCategories", "Members.AgeCategoryID", "Lookup_AgeCategories.ID")
                    .LeftJoin("ContactData", "Members.ContactDataID", "ContactData.ContactDataID")
                    .Select("MemberID", "FirstName", "LastName", "IsActive", "IsCompetitor", "JMBG", "BirthDate", "BirthPlace", "AgeCategoryID", "Note")
                    .SelectRaw("FirstName + ' ' + LastName as FullName")
                    .SelectRaw("Lookup_AgeCategories.Name as AgeCategory")
                    .SelectRaw("dbo.fnGetMemberDanceGroups(MemberID) as DanceGroups")
                    .SelectRaw("'' as Split")
                    .SelectRaw("ContactData.Address, ContactData.Email, ContactData.Phone1, ContactData.Phone2, ContactData.Phone3");

            if (filter != null)
            {
                bool excludeNonActive = true;
                if (filter.ExcludeNonActive.HasValue)
                {
                    excludeNonActive = (bool)filter.ExcludeNonActive;
                }

                if (excludeNonActive)
                {
                    q = q.WhereRaw("IsActive = 1");
                }

                if (!string.IsNullOrEmpty(filter.FullName))
                {
                    q = q.WhereRaw("lower(FirstName + ' ' + LastName) like '%" + filter.FullName.ToLower() + "%'");
                }

                if (!string.IsNullOrEmpty(filter.JMBG))
                {
                    q = q.WhereRaw("lower(JMBG) like '" + filter.JMBG.ToLower() + "%'");
                }

                if (filter.DanceGroupID.HasValue)
                {
                    q = q.WhereRaw(filter.DanceGroupID + " in (select DanceGroupID from fnGetMemberDanceGroupsAsTable(MemberID))");
                }

                // paging & sorting
                if (string.IsNullOrEmpty(filter.OrderByClause))
                {
                    // default order
                    filter.OrderByClause = "FullName";
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
            }

            var compiler = new SqlServerCompiler();
            SqlResult result = compiler.Compile(q);
            string sql = result.Sql;

            string connectionString = DALHelper.GetSqlConnectionStringFromEF();

            List<MemberModel> members = new List<MemberModel>();

            using (var connection = new SqlConnection(connectionString))
            {
                // Total
                response.Total = connection.Query<MemberModel>(sql).Count();

                // Data
                members = connection.Query<MemberModel, ContactDataModel, MemberModel>(
                    sql,
                    (member, contactData) => {
                        member.ContactData = contactData;
                        return member;
                    },
                    splitOn: "Split"
                )
                .OrderBy(filter.OrderByClause)
                .Skip((filter.PageNo - 1) * filter.RecordsPerPage)
                .Take(filter.RecordsPerPage)
                .AsList();
            }

            response.Data = members;

            return response;
        }

        public static ApiTableResponseModel<MemberModel> GetFilteredMembers(MemberFilterModel filter)
        {
            ApiTableResponseModel<MemberModel> response = new ApiTableResponseModel<MemberModel>();

            if (filter != null)
            {
                using (var ctx = new DFAppEntities())
                {
                    var q = ctx.Members
                                .Include(t => t.ChoreographyMembers)
                                .Include(t => t.DanceGroupMembers)
                                .Include(t => t.DanceSelectionMembers)
                                .Include(t => t.ContactData)
                                .Include(t => t.Lookup_AgeCategories)
                                .Include("Performances.Events")
                                .AsQueryable();

                    bool excludeNonActive = true;
                    if (filter.ExcludeNonActive.HasValue)
                    {
                        excludeNonActive = (bool)filter.ExcludeNonActive;
                    }

                    if (excludeNonActive)
                    {
                        q = q.Where(x => x.IsActive);
                    }

                    if (!string.IsNullOrEmpty(filter.FullName))
                    {
                        q = q.Where(x => (x.FirstName.ToLower() + " " + x.LastName.ToLower()).Contains(filter.FullName.ToLower()));
                    }

                    if (!string.IsNullOrEmpty(filter.JMBG))
                    {
                        q = q.Where(x => x.JMBG.StartsWith(filter.JMBG));
                    }

                    if (filter.ChoreoID.HasValue)
                    {
                        q = q.Where(x => x.ChoreographyMembers.Select(cm => cm.ChoreographyID).ToList().Contains((int)filter.ChoreoID));
                    }

                    if (filter.DanceGroupID.HasValue)
                    {
                        q = q.Where(x => x.DanceGroupMembers.Select(dgm => dgm.DanceGroupID).ToList().Contains((int)filter.DanceGroupID));
                    }

                    if (filter.DanceSelectionID.HasValue)
                    {
                        q = q.Where(x => x.DanceSelectionMembers.Select(dsm => dsm.DanceSelectionID).ToList().Contains((int)filter.DanceSelectionID));
                    }

                    if (filter.EventID.HasValue)
                    {
                        q = q.Where(x => x.Performances.Select(p => p.EventID).ToList().Contains((int)filter.EventID));
                    }

                    // paging & sorting
                    if (string.IsNullOrEmpty(filter.OrderByClause))
                    {
                        // default order
                        filter.OrderByClause = "FullName";
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
                                new MemberModel()
                                {
                                    MemberID = x.MemberID,
                                    FirstName = x.FirstName,
                                    LastName = x.LastName,
                                    FullName = x.FirstName + " " + x.LastName,
                                    IsActive = x.IsActive,
                                    IsCompetitor = x.IsCompetitor,
                                    JMBG = x.JMBG,
                                    BirthDate = x.BirthDate,
                                    BirthPlace = x.BirthPlace,
                                    AgeCategoryID = x.AgeCategoryID,
                                    AgeCategory = (x.Lookup_AgeCategories != null) ? x.Lookup_AgeCategories.Name : string.Empty,
                                    ProfileImage = x.ProfileImage,
                                    Note = x.Note,

                                    ContactData =
                                        new ContactDataModel()
                                        {
                                            Address = x.ContactData.Address,
                                            Email = x.ContactData.Email,
                                            Phone1 = x.ContactData.Phone1,
                                            Phone2 = x.ContactData.Phone2,
                                            Phone3 = x.ContactData.Phone3
                                        }
                                }
                            )
                            .OrderBy(filter.OrderByClause)
                            .Skip((filter.PageNo - 1) * filter.RecordsPerPage)
                            .Take(filter.RecordsPerPage);

                    response.Data = Data;
                }
            }

            return response;
        }

        public static MemberModel GetMember(int id)
        {
            MemberModel model = null;

            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.Members
                                    .Include(t => t.ContactData)
                                    .Include(t => t.Lookup_AgeCategories)
                                    .FirstOrDefault(x => x.MemberID == id);

                if (existing != null)
                {
                    model = new MemberModel();
                    model.MemberID = existing.MemberID;
                    model.FirstName = existing.FirstName;
                    model.LastName = existing.LastName;
                    model.FullName = existing.FirstName + " " + existing.LastName;
                    model.IsActive = existing.IsActive;
                    model.IsCompetitor = existing.IsCompetitor;
                    model.JMBG = existing.JMBG;
                    model.BirthDate = existing.BirthDate;
                    model.BirthPlace = existing.BirthPlace;
                    model.AgeCategoryID = existing.AgeCategoryID;
                    model.AgeCategory = (existing.Lookup_AgeCategories != null) ? existing.Lookup_AgeCategories.Name : string.Empty;
                    model.ProfileImage = existing.ProfileImage;
                    model.Note = existing.Note;

                    model.ContactData =
                        new ContactDataModel()
                        {
                            Address = existing.ContactData.Address,
                            Email = existing.ContactData.Email,
                            Phone1 = existing.ContactData.Phone1,
                            Phone2 = existing.ContactData.Phone2,
                            Phone3 = existing.ContactData.Phone3
                        };
                }
            }

            return model;
        }

        public static void CreateMember(MemberModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existingJMBG = ctx.Members.FirstOrDefault(x => x.JMBG == model.JMBG);
                if (existingJMBG != null)
                {
                    throw new Exception("error_members_jmbg_exists");
                }

                DBModel.Members m = new DBModel.Members();
                m.BirthDate = model.BirthDate;
                m.BirthPlace = model.BirthPlace;
                m.FirstName = model.FirstName;
                m.LastName = model.LastName;
                m.JMBG = model.JMBG;
                m.AgeCategoryID = model.AgeCategoryID;
                m.ProfileImage = model.ProfileImage;
                m.IsActive = true;
                m.Note = model.Note;

                if (model.IsCompetitor.HasValue)
                {
                    m.IsCompetitor = (bool)model.IsCompetitor;
                }
                else
                {
                    m.IsCompetitor = false;
                }

                m.ContactData = new ContactData();
                m.ContactData.Address = model.ContactData.Address;
                m.ContactData.Email = model.ContactData.Email;
                m.ContactData.Phone1 = model.ContactData.Phone1;
                m.ContactData.Phone2 = model.ContactData.Phone2;
                m.ContactData.Phone3 = model.ContactData.Phone3;

                if (model.DanceGroupID.HasValue)
                {
                    DanceGroupMembers dgMembers = new DanceGroupMembers();
                    dgMembers.DanceGroupID = (int)model.DanceGroupID;
                    dgMembers.MemberID = m.MemberID;
                    ctx.DanceGroupMembers.Add(dgMembers);
                }

                ctx.Members.Add(m);
                ctx.SaveChanges();
            }
        }

        public static void EditMember(int id, MemberModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.Members
                    .Include(t => t.ContactData)
                    .Include("MemberPayments.Payments")
                    .FirstOrDefault(x => x.MemberID == id);

                if (existing != null)
                {
                    if (!string.IsNullOrEmpty(model.FirstName))
                    {
                        existing.FirstName = model.FirstName;
                    }

                    if (!string.IsNullOrEmpty(model.LastName))
                    {
                        existing.LastName = model.LastName;
                    }

                    if (!string.IsNullOrEmpty(model.JMBG))
                    {
                        existing.JMBG = model.JMBG;
                    }

                    if (model.BirthDate.HasValue)
                    {
                        existing.BirthDate = model.BirthDate;
                    }

                    if (!string.IsNullOrEmpty(model.BirthPlace))
                    {
                        existing.BirthPlace = model.BirthPlace;
                    }

                    if (model.AgeCategoryID.HasValue)
                    {
                        existing.AgeCategoryID = model.AgeCategoryID;
                    }

                    if (!string.IsNullOrEmpty(model.ProfileImage))
                    {
                        existing.ProfileImage = model.ProfileImage;
                    }

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Address))
                    {
                        existing.ContactData.Address = model.ContactData.Address;
                    }

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Email))
                    {
                        existing.ContactData.Email = model.ContactData.Email;
                    }

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Phone1))
                    {
                        existing.ContactData.Phone1 = model.ContactData.Phone1;
                    }

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Phone2))
                    {
                        existing.ContactData.Phone2 = model.ContactData.Phone2;
                    }

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Phone3))
                    {
                        existing.ContactData.Phone3 = model.ContactData.Phone3;
                    }

                    if (model.IsActive.HasValue)
                    {
                        existing.IsActive = (bool)model.IsActive;

                        if (existing.IsActive)
                        {
                            // update member payments after reactivation
                            UpdateMemberPayments(ctx, existing);
                        }
                    }

                    if (model.IsCompetitor.HasValue)
                    {
                        existing.IsCompetitor = (bool)model.IsCompetitor;
                    }

                    existing.Note = model.Note;

                    ctx.SaveChanges();
                }
            }
        }

        public static void UpdateMemberPayments(DFAppEntities ctx, DBModel.Members existingMember)
        {
            var memberPayments = existingMember.MemberPayments.Where(x => x.Payments.Type.ToUpper() == "MONTHLY" || (x.Payments.Type.ToUpper() == "ONE-TIME" && x.Payments.NumberOfInstallments > 1)).ToList();

            if (memberPayments != null && memberPayments.Count() > 0)
            {
                foreach (var memberPayment in memberPayments)
                {
                    var installments = ctx.MemberPaymentInstallments.Where(x => x.MemberID == existingMember.MemberID && x.PaymentID == memberPayment.PaymentID).OrderByDescending(x => x.InstallmentDate).ToList();
                    if (installments != null && installments.Count() > 0)
                    {
                        var currentInstallment = installments.ElementAt(0);
                        while (currentInstallment.InstallmentDate.Date < DateTime.Now.Date)
                        {
                            var newInstallment = new MemberPaymentInstallments();
                            newInstallment.MemberID = existingMember.MemberID;
                            newInstallment.PaymentID = memberPayment.PaymentID;
                            newInstallment.InstallmentDate = currentInstallment.InstallmentDate.Date.AddMonths(1);
                            newInstallment.Amount = currentInstallment.Amount;
                            newInstallment.IsPaid = false;
                            newInstallment.IsCanceled = false;

                            ctx.MemberPaymentInstallments.Add(newInstallment);
                            currentInstallment = newInstallment;
                        }
                    }
                }
            }
        }

        #region Documents

        public static List<DocumentModel> GetDocuments(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.MemberDocuments
                            .Include("Documents.DocumentTypes")
                            .Include("Documents.Users")
                            .Where(md => md.MemberID == id)
                            .Select(x =>
                                new DocumentModel()
                                {
                                    DocumentID = x.DocumentID,
                                    DocumentName = x.Documents.DocumentName,
                                    DocumentDesc = x.Documents.DocumentDesc,
                                    DocumentCodedName = x.Documents.DocumentCodedName,
                                    DocumentFileName = x.Documents.DocumentFileName,
                                    DocumentFileExtension = x.Documents.DocumentFileExtension,
                                    DocumentTypeID = x.Documents.DocumentTypeID,
                                    DocumentType = x.Documents.DocumentTypes.DocumentTypeName,
                                    CreationDate = x.Documents.CreationDate,
                                    CreatedByUserID = x.Documents.CreatedByUserID,
                                    CreatedByUserFullName = (x.Documents.Users != null) ? (x.Documents.Users.FirstName + " " + x.Documents.Users.LastName) : string.Empty,
                                    DocumentPath = x.Documents.DocumentPath,

                                    Metadata = new DocumentMetadataModel() { ExpiryDate = x.Documents.DocumentMetadata.ExpiryDate }
                                }
                            )
                            .OrderByDescending(d => d.CreationDate)
                            .ThenBy(d => d.DocumentName)
                            .ToList();
            }
        }

        public static DocumentModel GetIndividualDocument(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var doc = ctx.Documents.FirstOrDefault(d => d.DocumentID == id);
                if (doc != null)
                {
                    return new DocumentModel()
                    {
                        CreatedByUserID = doc.CreatedByUserID,
                        CreationDate = doc.CreationDate,
                        DocumentCodedName = doc.DocumentCodedName,
                        DocumentFileName = doc.DocumentFileName,
                        DocumentFileExtension = doc.DocumentFileExtension,
                        DocumentPath = doc.DocumentPath
                    };
                }

                return null;
            }
        }

        public static void InsertDocument(int id, DocumentModel docModel)
        {
            using (var ctx = new DFAppEntities())
            {
                var memberDocs = ctx.MemberDocuments.Include(t => t.Documents).Where(mdoc => mdoc.MemberID == id);
                if (memberDocs != null)
                {
                    var existing = memberDocs.FirstOrDefault(d => d.Documents.DocumentName.ToLower() == docModel.DocumentName.ToLower());
                    if (existing != null)
                    {
                        throw new Exception("error_member_documents_doc_name_exists");
                    }
                }

                DBModel.Documents doc = new DBModel.Documents();
                doc.DocumentName = docModel.DocumentName;
                doc.DocumentDesc = docModel.DocumentDesc;
                doc.DocumentCodedName = docModel.DocumentCodedName;
                doc.DocumentFileName = docModel.DocumentFileName;
                doc.DocumentFileExtension = docModel.DocumentFileExtension;
                doc.DocumentTypeID = docModel.DocumentTypeID;
                doc.CreationDate = docModel.CreationDate;
                doc.CreatedByUserID = docModel.CreatedByUserID;
                doc.DocumentPath = docModel.DocumentPath;

                if (docModel.Metadata != null && docModel.Metadata.ExpiryDate.HasValue)
                {
                    doc.DocumentMetadata = new DocumentMetadata();
                    doc.DocumentMetadata.ExpiryDate = docModel.Metadata.ExpiryDate;
                }

                ctx.Documents.Add(doc);

                DBModel.MemberDocuments md = new MemberDocuments();
                md.DocumentID = doc.DocumentID;
                md.MemberID = id;
                ctx.MemberDocuments.Add(md);

                ctx.SaveChanges();
            }
        }

        public static void DeleteDocument(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var memberDocs = ctx.MemberDocuments
                                .Include(t => t.Documents.DocumentMetadata)
                                .Where(x => x.DocumentID == id)
                                .ToList();

                for (int i = memberDocs.Count() - 1; i >= 0; i--)
                {
                    var memberDoc = memberDocs.ElementAt(i);
                    var doc = memberDoc.Documents;

                    ctx.MemberDocuments.Remove(memberDoc);
                    ctx.Documents.Remove(doc);
                }

                ctx.SaveChanges();
            }
        }

        #endregion

        #region Dance groups

        public static List<DanceGroupModel> GetDanceGroups(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DanceGroupMembers
                            .Include("DanceGroups.Lookup_AgeCategories")
                            .Where(md => md.MemberID == id)
                            .Select(x =>
                                new DanceGroupModel()
                                {
                                    DanceGroupID = x.DanceGroupID,
                                    DanceGroupName = x.DanceGroups.DanceGroupName,
                                    DanceGroupDesc = x.DanceGroups.DanceGroupDesc,
                                    AgeCategoryID = x.DanceGroups.AgeCategoryID,
                                    AgeCategory = x.DanceGroups.Lookup_AgeCategories.Name
                                }
                            )
                            .OrderByDescending(d => d.DanceGroupName)
                            .ToList();
            }
        }

        public static void UpdateDanceGroups(int id, List<MemberDanceGroupModel> danceGroups)
        {
            using (var ctx = new DFAppEntities())
            {
                var member = ctx.Members.Include(t => t.DanceGroupMembers).FirstOrDefault(m => m.MemberID == id);
                if (member != null)
                {
                    if (member.DanceGroupMembers != null && member.DanceGroupMembers.Count() > 0)
                    {
                        for (int i = member.DanceGroupMembers.Count() - 1; i >= 0; i--)
                        {
                            ctx.DanceGroupMembers.Remove(member.DanceGroupMembers.ElementAt(i));
                        }
                    }

                    foreach (var danceGroupModel in danceGroups)
                    {
                        DBModel.DanceGroupMembers memberGroup = new DanceGroupMembers();
                        memberGroup.MemberID = id;
                        memberGroup.DanceGroupID = danceGroupModel.DanceGroupID;
                        ctx.DanceGroupMembers.Add(memberGroup);
                    }

                    ctx.SaveChanges();
                }
            }
        }

        #endregion

        #region Payments

        public static List<MemberPaymentModel> GetMemberPayments(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var payments = ctx.MemberPayments
                                    .Include(t => t.Members.Lookup_AgeCategories)
                                    .Include(t => t.Payments.MemberPaymentsForCompanions)
                                    .Include(t => t.Payments.MemberPaymentInstallments)
                                    .Where(p => p.MemberID == id);

                return payments.Select(x =>
                            new MemberPaymentModel()
                            {
                                MemberID = x.MemberID,
                                ID = x.PaymentID,
                                Payment =
                                    new PaymentModel()
                                    {
                                        ID = x.PaymentID,
                                        Name = x.Payments.Name,
                                        Description = x.Payments.Description,
                                        Type = x.Payments.Type,
                                        Amount = x.Payments.Amount,
                                        AmountForCompanion = x.Payments.AmountForCompanion,
                                        Currency = x.Payments.Currency,
                                        NumberOfInstallments = x.Payments.NumberOfInstallments,
                                        InstallmentAmounts = x.Payments.InstallmentAmounts,
                                        InstallmentAmountsForCompanion = x.Payments.InstallmentAmountsForCompanion,
                                        DueDate = x.Payments.DueDate
                                    },

                                DiscountAmount = x.DiscountAmount,
                                DiscountPercentage = x.DiscountPercentage,

                                Companions = 
                                    x.Payments.MemberPaymentsForCompanions.Where(mpc => mpc.MemberID == id).Select(c =>
                                        new CompanionModel()
                                        {
                                            Name = c.CompanionName,
                                            Phone = c.CompanionPhone,
                                            Email = c.CompanionEmail
                                        }
                                    )
                                    .ToList(),

                                Installments 
                                    = x.Payments.MemberPaymentInstallments.Where(mpi => mpi.MemberID == id).Select(i =>
                                        new InstallmentModel()
                                        {
                                            ID = i.ID,
                                            InstallmentDate = i.InstallmentDate,
                                            Amount = (decimal)i.Amount,
                                            IsPaid = i.IsPaid,
                                            IsCanceled = i.IsCanceled,
                                            PaymentDate = i.PaymentDate,
                                            Note = i.Note
                                        }
                                    )
                                    .OrderByDescending(i => i.InstallmentDate)
                                    .ToList()
                            }
                       )
                       .OrderBy(p => p.Payment.Name)
                       .ToList();
            }
        }

        public static List<InstallmentModel> GetMemberPaymentInstallments(int memberID, int paymentID)
        {
            using (var ctx = new DFAppEntities())
            {
                var mp = ctx.MemberPaymentInstallments
                                .Where(x => x.MemberID == memberID && x.PaymentID == paymentID);

                if (mp != null)
                {
                    return mp.Select(x =>
                                new InstallmentModel()
                                {
                                    ID = x.ID,
                                    InstallmentDate = x.InstallmentDate,
                                    Amount = (decimal)x.Amount,
                                    IsPaid = x.IsPaid,
                                    IsCanceled = x.IsCanceled,
                                    PaymentDate = x.PaymentDate,
                                    Note = x.Note
                                }
                           )
                           .OrderByDescending(i => i.InstallmentDate)
                           .ToList();
                }

                return null;
            }
        }

        public static void AddMemberPayment(int memberID, MemberPaymentModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var member = ctx.Members.FirstOrDefault(m => m.MemberID == memberID);
                if (member != null)
                {
                    MemberPayments memberPayment = new MemberPayments()
                    {
                        MemberID = memberID,
                        PaymentID = model.ID,
                        DiscountPercentage = model.DiscountPercentage
                    };
                    ctx.MemberPayments.Add(memberPayment);

                    if (model.Companions != null && model.Companions.Count() > 0)
                    {
                        foreach (var companion in model.Companions)
                        {
                            MemberPaymentsForCompanions companionPayment = new MemberPaymentsForCompanions()
                            {
                                MemberID = memberID,
                                PaymentID = model.ID,
                                CompanionName = companion.Name,
                                CompanionPhone = companion.Phone,
                                CompanionEmail = companion.Email
                            };
                            ctx.MemberPaymentsForCompanions.Add(companionPayment);
                        }
                    }

                    foreach (var installment in model.Installments)
                    {
                        MemberPaymentInstallments memberInstallment = new MemberPaymentInstallments()
                        {
                            MemberID = memberID,
                            PaymentID = model.ID,
                            InstallmentDate = (DateTime)installment.InstallmentDate,
                            Amount = installment.Amount,
                            IsPaid = false,
                            IsCanceled = false
                        };
                        ctx.MemberPaymentInstallments.Add(memberInstallment);
                    }

                    ctx.SaveChanges();
                }
            }
        }

        public static void DeleteMemberPayment(int memberID, int paymentID)
        {
            using (var ctx = new DFAppEntities())
            {
                var memberPayment = 
                    ctx.MemberPayments
                        .FirstOrDefault(mp => mp.MemberID == memberID && mp.PaymentID == paymentID);

                if (memberPayment != null)
                {
                    // can be deleted only if all installments are canceled
                    var installments = ctx.MemberPaymentInstallments.Where(mpi => mpi.MemberID == memberID && mpi.PaymentID == paymentID).ToList();
                    if (installments != null && installments.Count() > 0)
                    {
                        for (int i = installments.Count() - 1; i >= 0; i--)
                        {
                            var installment = installments.ElementAt(i);
                            if (!installment.IsCanceled)
                            {
                                throw new Exception("error_member_payments_delete_installment_not_canceled");
                            }

                            ctx.MemberPaymentInstallments.Remove(installment);
                        }
                    }

                    // delete member payment companions
                    var companions = ctx.MemberPaymentsForCompanions.Where(mpc => mpc.MemberID == memberID && mpc.PaymentID == paymentID).ToList();
                    if (companions != null && companions.Count() > 0)
                    {
                        for (int j = companions.Count() - 1; j >= 0; j--)
                        {
                            var companion = companions.ElementAt(j);
                            ctx.MemberPaymentsForCompanions.Remove(companion);
                        }
                    }

                    // delete member payment
                    ctx.MemberPayments.Remove(memberPayment);

                    ctx.SaveChanges();
                }
            }
        }

        public static void EditMemberPaymentInstallment(int id, InstallmentModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var installment = ctx.MemberPaymentInstallments.FirstOrDefault(x => x.ID == id);
                if (installment != null)
                {
                    if (model.IsPaid.HasValue)
                    {
                        installment.IsPaid = (bool)model.IsPaid;

                        if (installment.IsPaid && !model.PaymentDate.HasValue)
                        {
                            installment.PaymentDate = DateTime.Now;
                        }

                        if (!installment.IsPaid)
                        {
                            installment.PaymentDate = null;
                        }
                    }

                    if (model.PaymentDate.HasValue && installment.IsPaid)
                    {
                        installment.PaymentDate = model.PaymentDate;
                    }

                    if (model.IsCanceled.HasValue)
                    {
                        installment.IsCanceled = (bool)model.IsCanceled;
                    }

                    if (!string.IsNullOrEmpty(model.Note))
                    {
                        installment.Note = model.Note;
                    }

                    ctx.SaveChanges();
                }
            }
        }

        #endregion
    }
}
