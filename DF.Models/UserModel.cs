using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.Models
{
    public class UserModel
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }

        public string FullName { get; set; }

        public List<UserGroupModel> UserGroups { get; set; }

        // change password support
        public string OldPassword { get; set; }
    }
}
