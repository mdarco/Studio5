using DF.DB.DBModel;
using DF.Models;
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
        public static UserModel AuthenticateUser(string username, string password)
        {
            UserModel model = null;

            using (var ctx = new DFAppEntities())
            {
                byte[] data = Encoding.UTF8.GetBytes(password);
                data = new SHA256Managed().ComputeHash(data);
                string hashPassword = Encoding.UTF8.GetString(data);

                var u = ctx.Users.Include("UserGroupMembers.UserGroups").FirstOrDefault(user => user.Username.ToLower() == username.ToLower() && (user.Password == hashPassword || user.Password == password));

                if (u != null)
                {
                    if (!u.IsActive)
                    {
                        throw new Exception("errors_login_user_not_active");
                    }

                    model = new UserModel();
                    model.UserID = u.UserID;
                    model.Username = u.Username;
                    model.FirstName = u.FirstName;
                    model.LastName = u.LastName;
                    model.FullName = string.Format("{0} {1}", u.FirstName, u.LastName);

                    model.UserGroups =
                        u.UserGroupMembers.Select(ugm =>
                            new UserGroupModel()
                            {
                                UserGroupID = ugm.UserGroupID,
                                UserGroupName = ugm.UserGroups.UserGroupName
                            }
                        )
                        .OrderBy(ug => ug.UserGroupName)
                        .ToList();
                }
            }

            return model;
        }
    }
}
