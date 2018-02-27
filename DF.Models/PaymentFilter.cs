using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class PaymentFilter
    {
        public string Name { get; set; }
        public bool? IsActive { get; set; }
        public List<int> ExcludeID { get; set; }
    }
}
