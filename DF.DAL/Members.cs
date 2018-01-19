using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace DF.DB
{
    public static class Members
    {
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

                ctx.Members.Add(m);
                ctx.SaveChanges();
            }
        }

        public static void EditMember(int id, MemberModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.Members.FirstOrDefault(x => x.MemberID == id);
                if (existing != null)
                {
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

                    if (model.ContactData != null && !string.IsNullOrEmpty(model.ContactData.Address))
                    {
                        existing.ContactData.Address = model.ContactData.Address;
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
                    }

                    if (model.IsCompetitor.HasValue)
                    {
                        existing.IsCompetitor = (bool)model.IsCompetitor;
                    }

                    ctx.SaveChanges();
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
    }
}
