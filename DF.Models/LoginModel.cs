using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class LoginModel
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }

        public bool IsAuthenticated { get; set; }

        public List<string> UserGroups { get; set; }

        public List<string> EffectivePermissions { get; set; }

        public List<DanceGroupModel> UserDanceGroups { get; set; }
    }
}
