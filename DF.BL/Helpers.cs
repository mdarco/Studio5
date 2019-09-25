using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using word = Microsoft.Office.Interop.Word;
using excel = Microsoft.Office.Interop.Excel;
using System.Data;

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

        public static byte[] GetBytesFromDataUrl(string dataUrl)
        {
            string base64Data = dataUrl.Split(';')[1];
            string data = base64Data.Split(',')[1];

            return Convert.FromBase64String(data);
        }

        public static DataTable DynamicToDataTable(IEnumerable<dynamic> items)
        {
            if (items == null) return null;

            var data = items.ToArray();
            if (data.Length == 0) return null;

            var dt = new DataTable();
            foreach (var pair in ((IDictionary<string, object>)data[0]))
            {
                dt.Columns.Add(pair.Key, (pair.Value ?? string.Empty).GetType());
            }

            foreach (var d in data)
            {
                dt.Rows.Add(((IDictionary<string, object>)d).Values.ToArray());
            }

            return dt;
        }

        //public static byte[] ConvertWordToPdf(string wordFilePath)
        //{
        //    byte[] result;

        //    word.Application app = new word.Application();

        //    if (app != null)
        //    {
        //        word.Document doc = app.Documents.Open(wordFilePath);

        //        if (doc != null)
        //        {
        //            string tmpPdfFile = Path.GetTempFileName();
        //            doc.SaveAs2(tmpPdfFile, word.WdSaveFormat.wdFormatPDF);
        //            result = File.ReadAllBytes(tmpPdfFile);
        //            File.Delete(tmpPdfFile);

        //            doc.Close(word.WdSaveOptions.wdDoNotSaveChanges);
        //            app.Quit();

        //            return result;
        //        }

        //        throw new Exception("MS Word dokument se ne moze otvoriti.");
        //    }

        //    throw new Exception("MS Word nije instaliran ili se ne moze pokrenuti.");
        //}
    }
}
