using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.BL
{
    public static class Helpers
    {
        public static string GetMimeType(string fileExtension)
        {
            switch (fileExtension.ToLower())
            {
                case "pdf":
                    return "application/pdf";

                case "jpg":
                case "jpeg":
                    return "image/jpeg";

                case "png":
                    return "image/png";

                case "csv":
                    return "text/csv";

                case "txt":
                    return "text/plain";

                case "xls":
                case "xlsx":
                    return "application/vnd.ms-excel";

                case "doc":
                case "docx":
                    return "application/msword";

                //case "docx":
                //	return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                default:
                    return "application/octet-stream"; // arbitrary binary data
            }
        }
    }
}
