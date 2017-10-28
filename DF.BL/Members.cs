using DF.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.BL
{
    public static class Members
    {
        public static void InsertDocument(MemberDocumentModel model)
        {
            DocumentModel docModel = Documents.ConvertMemberDocumentModelToDocModel(model);

            // first save file to file system
            File.WriteAllBytes(docModel.DocumentPhysicalPath, docModel.Bytes);

            try
            {
                // then insert doc data into DB
                DB.Members.InsertDocument(model.MemberID, docModel);
            }
            catch (Exception ex)
            {
                File.Delete(docModel.DocumentPhysicalPath);

                throw ex;
            }
        }
    }
}
