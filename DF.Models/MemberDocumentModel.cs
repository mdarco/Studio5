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

        // doc type
        public int DocumentTypeID { get; set; }
    }
}
