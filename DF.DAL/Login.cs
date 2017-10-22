using DF.DB.DBModel;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Login
    {
        public static int? AuthenticateUser(string username, string password)
        {
            using (var ctx = new DFAppEntities())
            {
                byte[] data = Encoding.UTF8.GetBytes(password);
                data = new SHA256Managed().ComputeHash(data);
                string hashPassword = Encoding.UTF8.GetString(data);

                var u = ctx.Users.FirstOrDefault(user => user.Username.ToLower() == username.ToLower() && (user.Password == hashPassword || user.Password == password));
                return (u != null) ? u.UserID : (int?)null;
            }
        }
    }
}
