using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using DF.BL;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/documents")]
    public class DocumentsController : ApiController
    {
        [Route("{id}/download")]
        [HttpGet]
        public HttpResponseMessage DownloadDocument(int id)
        {
            HttpResponseMessage result = null;

            // full path to coded file name file with '.tim' extension
            string docPath = Documents.GetPath(id, true);

            // decoded document file name
            string docFileName = DB.Documents.GetFileName(id);

            byte[] fileBytes = File.ReadAllBytes(docPath);

            result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(fileBytes);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = docFileName;
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(Helpers.GetMimeType(Path.GetExtension(docFileName).Substring(1)));

            return result;
        }

        [Route("{id}/data-url")]
        [HttpGet]
        public string GetDocumentDataUrl(int id)
        {
            byte[] fileBytes;

            // full path to coded file name file with '.tim' extension
            string docPath = Documents.GetPath(id, true);

            // decoded document file name
            string docFileName = DB.Documents.GetFileName(id);

            string fileType = Path.GetExtension(docFileName);
            if (fileType.ToLower() == ".docx" || fileType.ToLower() == ".doc" || fileType.ToLower() == ".xlsx" || fileType.ToLower() == ".xls")
            {
                // TODO: convert Word/Excel to PDF here
                throw new Exception("Nije moguc prikaz Word i Excel dokumenata.");
            }
            else
            {
                if (File.Exists(docPath))
                {
                    fileBytes = File.ReadAllBytes(docPath);
                }
                else
                {
                    throw new Exception("Trazeni dokument nije pronadjen.");
                }
            }

            // get base64 string
            string base64String = Convert.ToBase64String(fileBytes, 0, fileBytes.Length);

            // get file mime-type
            string mimeType = Helpers.GetMimeType(Path.GetExtension(docFileName).Substring(1));
            
            //var dataUrl = "data:application/pdf;base64," + base64String;
            string dataUrl = "data:" + mimeType + ";base64," + base64String;

            return dataUrl;
        }
    }
}
