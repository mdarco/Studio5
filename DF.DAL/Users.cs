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
    public static class Users
    {
        public static List<UserModel> GetUsers()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Users
                    .Where(x => x.Username.ToLower() != "mdarco")
                    .Select(u =>
                        new UserModel()
                        {
                            UserID = u.UserID,
                            Username = u.Username,
                            Password = u.Password,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            FullName = u.FirstName + " " + u.LastName
                        }
                    )
                    .OrderBy(u => u.FirstName)
                    .ToList();
            }
        }

        public static List<UserModel> GetUsersFilter(UserFilterModel filter)
        {
            using (var ctx = new DFAppEntities())
            {
                IQueryable<DBModel.Users> query = ctx.Users.Where(x => x.Username.ToLower() != "mdarco");

                if (filter != null && filter.Username != null && filter.Username.Trim().Length != 0)
                {
                    query = query.Where(u => u.Username.Contains(filter.Username.Trim()));
                }

                if (filter != null && filter.FirstName != null && filter.FirstName.Trim().Length != 0)
                {
                    query = query.Where(u => u.FirstName.Contains(filter.FirstName.Trim()));
                }

                if (filter != null && filter.LastName != null && filter.LastName.Trim().Length != 0)
                {
                    query = query.Where(u => u.LastName.Contains(filter.LastName.Trim()));
                }

                return query.Select(u =>
                        new UserModel()
                        {
                            UserID = u.UserID,
                            Username = u.Username,
                            Password = u.Password,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            FullName = u.FirstName + " " + u.LastName
                        }
                    )
                    .OrderBy(u => u.FullName)
                    .ToList();
            }
        }

        public static UserModel GetIndividualUser(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                UserModel model = null;

                var user = ctx.Users.FirstOrDefault(u => u.UserID == id);
                if (user != null)
                {
                    model = new UserModel();
                    model.UserID = user.UserID;
                    model.Username = user.Username;
                    model.FirstName = user.FirstName;
                    model.LastName = user.LastName;
                    model.FullName = user.FirstName + " " + user.LastName;
                }

                return model;
            }
        }

        public static void ManageUser(UserModel model)
        {
            if (model.UserID == -1 || model.UserID == 0)
            {
                AddUser(model);
            }
            else
            {
                EditUser(model);
            }
        }

        private static int AddUser(UserModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.Users.FirstOrDefault(x => x.Username.ToLower() == model.Username.ToLower());
                if (existing != null)
                {
                    throw new Exception("error_users_username_exists");
                }

                DBModel.Users u = new DBModel.Users();
                u.Username = model.Username;

                // decode password from base64
                byte[] decodedData = Convert.FromBase64String(model.Password);
                string decodedPass = Encoding.UTF8.GetString(decodedData);

                // change password
                byte[] data = Encoding.UTF8.GetBytes(decodedPass);
                data = new SHA256Managed().ComputeHash(data);
                string hashPassword = Encoding.UTF8.GetString(data);
                u.Password = hashPassword;

                u.FirstName = model.FirstName;
                u.LastName = model.LastName;

                ctx.Users.Add(u);
                ctx.SaveChanges();

                return u.UserID;
            }
        }

        private static void EditUser(UserModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.FirstOrDefault(u => u.UserID == model.UserID);
                if (user != null)
                {
                    var existing = ctx.Users.FirstOrDefault(x => x.Username.ToLower() == model.Username.ToLower());
                    if (existing != null)
                    {
                        throw new Exception("error_users_username_exists");
                    }

                    //UserID = model.UserID;
                    user.Username = model.Username;

                    // decode password from base64
                    byte[] decodedData = Convert.FromBase64String(model.Password);
                    string decodedPass = Encoding.UTF8.GetString(decodedData);

                    byte[] data = Encoding.UTF8.GetBytes(decodedPass);
                    data = new SHA256Managed().ComputeHash(data);
                    string hashPassword = Encoding.UTF8.GetString(data);
                    user.Password = hashPassword;

                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;

                    ctx.SaveChanges();
                }
            }
        }

        public static void DeleteUser(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.FirstOrDefault(u => u.UserID == id);
                if (user != null)
                {
                    ctx.Users.Remove(user);
                    ctx.SaveChanges();
                }
            }
        }

        public static void ChangePassword(UserModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.FirstOrDefault(u => u.UserID == model.UserID);
                if (user != null)
                {
                    // decode password from base64
                    byte[] decodedData = Convert.FromBase64String(model.Password);
                    string decodedPass = Encoding.UTF8.GetString(decodedData);

                    // change password
                    byte[] data = Encoding.UTF8.GetBytes(decodedPass);
                    data = new SHA256Managed().ComputeHash(data);
                    string hashPassword = Encoding.UTF8.GetString(data);
                    user.Password = hashPassword;

                    ctx.SaveChanges();
                }
            }
        }

        public static List<UserGroupModel> GetUserGroups(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserGroupMembers.Include("UserGroups").Where(ugm => ugm.UserID == id)
                        .Select(ugm =>
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

        #region User permissions

        // gets effective user permissions (user groups permissions + user permissions)
        public static List<string> GetEffectivePermissions(int userID)
        {
            List<PermissionModel> userGroupPermissions = new List<PermissionModel>();
            List<PermissionModel> userPermissions = GetPermissions(userID);

            List<UserGroupModel> userGroups = GetUserGroups(userID);
            foreach (var userGroup in userGroups)
            {
                userGroupPermissions.AddRange(UserGroups.GetPermissions(userGroup.UserGroupID));
            }

            return userPermissions.Union(userGroupPermissions)
                    .Select(p => p.PermissionName)
                    .Distinct()
                    .ToList();
        }

        public static List<PermissionModel> GetPermissions(int userID)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserPermissions.Include("Permissions").Where(udt => udt.UserID == userID)
                        .Select(up =>
                            new PermissionModel()
                            {
                                PermissionID = up.PermissionID,
                                PermissionName = up.Permissions.PermissionName
                            }
                        )
                        .OrderBy(p => p.PermissionName)
                        .ToList();
            }
        }

        public static void DeleteAllPermissionsByUser(int userID)
        {
            using (var ctx = new DFAppEntities())
            {
                var ugm = ctx.UserPermissions.Where(u => u.UserID == userID).ToList();
                if (ugm.Count() > 0)
                {
                    foreach (UserPermissions gm in ugm)
                    {
                        ctx.UserPermissions.Remove(gm);
                        ctx.SaveChanges();
                    }
                }
            }
        }

        public static void AddUserPermissions(int userID, List<PermissionModel> permissions)
        {
            for (int i = 0; i < permissions.Count; i++)
            {
                int curentUserPermissionID = permissions[i].PermissionID;
                AddUserPermission(userID, curentUserPermissionID);
            }
        }

        private static void AddUserPermission(int userID, int curentUserPermissionID)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.Where(u => u.UserID == userID).FirstOrDefault();
                var permission = ctx.Permissions.Where(ug => ug.PermissionID == curentUserPermissionID).FirstOrDefault();

                if (user != null && permission != null)
                {
                    UserPermissions up = new UserPermissions();
                    up.PermissionID = curentUserPermissionID;
                    up.UserID = userID;

                    user.UserPermissions.Add(up);
                    ctx.SaveChanges();
                }
            }
        }

        #endregion

        #region User group members

        public static void DeleteUserGroupMembers(int userGroupID, int userID)
        {
            using (var ctx = new DFAppEntities())
            {
                var ugm = ctx.UserGroupMembers.FirstOrDefault(u => u.UserGroupID == userGroupID && u.UserID == userID);
                if (ugm != null)
                {
                    ctx.UserGroupMembers.Remove(ugm);
                    ctx.SaveChanges();
                }
            }
        }

        public static void DeleteAllUserGroupMembersByUser(int userID)
        {
            using (var ctx = new DFAppEntities())
            {
                var ugm = ctx.UserGroupMembers.Where(u => u.UserID == userID).ToList();
                if (ugm.Count() > 0)
                {
                    foreach (UserGroupMembers gm in ugm)
                    {
                        ctx.UserGroupMembers.Remove(gm);
                        ctx.SaveChanges();
                    }
                }
            }
        }

        public static void AddUserInGroups(int userID, List<UserGroupModel> userGroups)
        {
            for (int i = 0; i < userGroups.Count; i++)
            {
                int currentUserGroupID = userGroups[i].UserGroupID;
                AddUserInGroup(userID, currentUserGroupID);
            }
        }

        private static void AddUserInGroup(int userID, int currentUserGroupID)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.Where(u => u.UserID == userID).FirstOrDefault();
                var userGroup = ctx.UserGroups.Where(ug => ug.UserGroupID == currentUserGroupID).FirstOrDefault();

                if (user != null && userGroup != null)
                {
                    UserGroupMembers ugm = new UserGroupMembers();
                    ugm.UserGroupID = currentUserGroupID;
                    ugm.UserID = userID;

                    user.UserGroupMembers.Add(ugm);
                    ctx.SaveChanges();
                }
            }
        }

        #endregion
    }
}
