﻿using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Documents
    {
        public static string GetFileName(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var doc = ctx.Documents.FirstOrDefault(d => d.DocumentID == id);
                if (doc != null)
                {
                    return string.Format("{0}.{1}", doc.DocumentFileName, doc.DocumentFileExtension);
                }

                return string.Empty;
            }
        }

        public static string GetCodedName(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var doc = ctx.Documents.FirstOrDefault(d => d.DocumentID == id);
                if (doc != null)
                {
                    return doc.DocumentCodedName;
                }

                return string.Empty;
            }
        }

        #region Doc types

        public static List<LookupModel> GetDocTypesAsLookup()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.DocumentTypes
                            .Select(x =>
                                new LookupModel()
                                {
                                    ID = x.DocumentTypeID,
                                    Name = x.DocumentTypeName
                                }
                            )
                            .ToList();
            }
        }

        #endregion
    }
}
