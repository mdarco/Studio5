using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class MemberDocumentModel
    {
        public int MemberID { get; set; }
        public FileModel File { get; set; }

        public string DocumentName { get; set; }
        public string DocumentDesc { get; set; }
        public int? DocumentTypeID { get; set; }
        public DocumentMetadataModel DocMetadata { get; set; }

        public int? UserID { get; set; }
    }
}
