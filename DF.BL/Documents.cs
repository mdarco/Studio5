using DF.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Text;
using System.IO;
using System.Threading.Tasks;

namespace DF.BL
{
    public static class Documents
    {
        public static string GetPhysicalPath()
        {
            NameValueCollection section = ConfigurationManager.GetSection("timdms") as NameValueCollection;
            if (section == null)
            {
                throw new Exception("There is no <timdms> section in the configuration file!");
            }
            else
            {
                string serverDocumentStore = section["ServerDocumentStore"];
                if (string.IsNullOrWhiteSpace(serverDocumentStore))
                {
                    throw new Exception("Server document store is not defined!");
                }

                return serverDocumentStore;
            }
        }

        public static string GetVirtualPath()
        {
            NameValueCollection section = ConfigurationManager.GetSection("timdms") as NameValueCollection;
            if (section == null)
            {
                throw new Exception("There is no <timdms> section in the configuration file!");
            }
            else
            {
                string serverDocumentStoreVirtualRoot = section["ServerDocumentStoreVirtualRoot"];
                if (string.IsNullOrWhiteSpace(serverDocumentStoreVirtualRoot))
                {
                    throw new Exception("Server document store virtual root is not defined!");
                }

                return serverDocumentStoreVirtualRoot;
            }
        }

        public static string GetPath(int id, bool physical)
        {
            string separator = physical ? @"\" : @"/";

            string docStoreRoot = physical ? GetPhysicalPath() : GetVirtualPath();
            string documentCodedName = DB.Documents.GetCodedName(id);

            return string.Format("{0}{1}{2}{3}.tim", docStoreRoot, string.Empty, separator, documentCodedName);
        }

        public static DocumentModel ConvertMemberDocumentModelToDocModel(MemberDocumentModel model)
        {
            DocumentModel docModel = new DocumentModel();
            docModel.DocumentName = Path.GetFileNameWithoutExtension(model.File.FileName);
            docModel.DocumentTypeID = model.DocumentTypeID;
            docModel.DocumentCodedName = Guid.NewGuid().ToString();
            docModel.CreationDate = DateTime.Now;

            // document file name & extension
            docModel.DocumentFileName = Path.GetFileNameWithoutExtension(model.File.FileName);
            docModel.DocumentFileExtension = Path.GetExtension(model.File.FileName).Substring(1);

            // get file bytes
            docModel.Bytes = Helpers.GetBytesFromDataUrl(model.File.DataUrl);

            // determine folder to store the document
            docModel.DocumentPhysicalPath = string.Format(@"{0}{1}\{2}",
                GetPhysicalPath(),
                string.Empty,
                string.Format("{0}.tim", docModel.DocumentCodedName));

            // document path (relative to the document store path)
            docModel.DocumentPath = string.Format(@"{0}\{1}", string.Empty, docModel.DocumentCodedName);

            if (model.UserID.HasValue)
            {
                docModel.CreatedByUserID = model.UserID;
            }

            return docModel;
        }
    }
}
