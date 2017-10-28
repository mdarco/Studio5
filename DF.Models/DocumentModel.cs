using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class DocumentModel
    {
        public int DocumentID { get; set; }
        public string DocumentName { get; set; }
        public string DocumentDesc { get; set; }
        public string DocumentCodedName { get; set; }
        public string DocumentFileName { get; set; }
        public string DocumentFileExtension { get; set; }
        public string DocumentPath { get; set; }
        public string DocumentPhysicalPath { get; set; }

        public int? DocumentTypeID { get; set; }
        public string DocumentType { get; set; }

        public DateTime CreationDate { get; set; }
        public int? CreatedByUserID { get; set; }
        public string CreatedByUserFullName { get; set; }

        public byte[] Bytes { get; set; }

        public DocumentMetadataModel Metadata { get; set; }
    }
}
