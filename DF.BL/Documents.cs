using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Text;
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
    }
}
