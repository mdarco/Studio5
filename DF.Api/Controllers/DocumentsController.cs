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
            string docFileName = Documents.GetFileName(id);

            byte[] fileBytes = File.ReadAllBytes(docPath);

            result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(fileBytes);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = docFileName;
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(Helpers.GetMimeType(Path.GetExtension(docFileName).Substring(1)));

            return result;
        }
    }
}
