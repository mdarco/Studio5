using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
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
                    .Include("UserGroupMembers.UserGroups")
                    .Where(x => x.Username.ToLower() != "mdarco")
                    .Select(u =>
                        new UserModel()
                        {
                            UserID = u.UserID,
                            Username = u.Username,
                            Password = u.Password,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            LastLoginAt = u.LastLoginAt,
                            IsActive = u.IsActive,
                            FullName = u.FirstName + " " + u.LastName,

                            UserGroups = 
                                u.UserGroupMembers.Select(ugm =>
                                    new UserGroupModel()
                                    {
                                        UserGroupID = ugm.UserGroupID,
                                        UserGroupName = ugm.UserGroups.UserGroupName
                                    }
                                )
                                .OrderBy(ug => ug.UserGroupName)
                                .ToList()
                        }
                    )
                    .OrderBy(u => u.FirstName)
                    .ThenBy(u => u.LastName)
                    .ToList();
            }
        }

        public static List<UserModel> GetUsersFiltered(UserFilterModel filter)
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
                            FullName = u.FirstName + " " + u.LastName,

                            UserGroups =
                                u.UserGroupMembers.Select(ugm =>
                                    new UserGroupModel()
                                    {
                                        UserGroupID = ugm.UserGroupID,
                                        UserGroupName = ugm.UserGroups.UserGroupName
                                    }
                                )
                                .OrderBy(ug => ug.UserGroupName)
                                .ToList()
                        }
                    )
                    .OrderBy(u => u.FullName)
                    .ThenBy(u => u. LastName)
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
                u.IsActive = true;

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
                    if (model.Username != user.Username)
                    {
                        var existing = ctx.Users.FirstOrDefault(x => x.Username.ToLower() == model.Username.ToLower());
                        if (existing != null)
                        {
                            throw new Exception("error_users_username_exists");
                        }

                        user.Username = model.Username;
                    }

                    // decode password from base64
                    byte[] decodedData = Convert.FromBase64String(model.Password);
                    string decodedPass = Encoding.UTF8.GetString(decodedData);

                    byte[] data = Encoding.UTF8.GetBytes(decodedPass);
                    data = new SHA256Managed().ComputeHash(data);
                    string hashPassword = Encoding.UTF8.GetString(data);

                    if (hashPassword != user.Password)
                    {
                        user.Password = hashPassword;
                    }

                    if (model.FirstName != user.FirstName)
                    {
                        user.FirstName = model.FirstName;
                    }

                    if (model.LastName != user.LastName)
                    {
                        user.LastName = model.LastName;
                    }

                    if (model.IsActive != user.IsActive)
                    {
                        user.IsActive = model.IsActive;
                    }

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

        public static void ChangePassword(int userID, UserModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.Users.FirstOrDefault(u => u.UserID == userID);
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

        public static void DeleteUserFromGroup(int userID, int userGroupID)
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

        public static void AddUserToGroups(int userID, List<UserGroupModel> userGroups)
        {
            using (var ctx = new DFAppEntities())
            {
                // first delete all membership info
                var membership = ctx.UserGroupMembers.Where(x => x.UserID == userID).ToList();
                if (membership.Count() > 0)
                {
                    for (int i = membership.Count() - 1; i >= 0; i--)
                    {
                        ctx.UserGroupMembers.Remove(membership.ElementAt(i));
                    }
                }

                // add new membership info
                foreach(var group in userGroups)
                {
                    UserGroupMembers ugm = new UserGroupMembers();
                    ugm.UserGroupID = group.UserGroupID;
                    ugm.UserID = userID;

                    ctx.UserGroupMembers.Add(ugm);
                }

                ctx.SaveChanges();
            }
        }

        #endregion

        #region User dance groups

        public static List<DanceGroupModel> GetUserDanceGroups(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserDanceGroups.Include("DanceGroups").Where(udg => udg.UserID == id)
                        .Select(udg =>
                            new DanceGroupModel()
                            {
                                DanceGroupID = udg.DanceGroupID,
                                DanceGroupName = udg.DanceGroups.DanceGroupName,
                                HasPaymentAbility = udg.HasPaymentAbility
                            }
                        )
                        .OrderBy(udg => udg.DanceGroupName)
                        .ToList();
            }
        }

        public static void AddUserToDanceGroups(int userID, List<DanceGroupModel> userDanceGroups)
        {
            using (var ctx = new DFAppEntities())
            {
                // first delete all dance groups membership info
                var membership = ctx.UserDanceGroups.Where(x => x.UserID == userID).ToList();
                if (membership.Count() > 0)
                {
                    for (int i = membership.Count() - 1; i >= 0; i--)
                    {
                        ctx.UserDanceGroups.Remove(membership.ElementAt(i));
                    }
                }

                // add new membership info
                foreach (var group in userDanceGroups)
                {
                    UserDanceGroups udg = new UserDanceGroups();
                    udg.DanceGroupID = group.DanceGroupID;
                    udg.UserID = userID;

                    ctx.UserDanceGroups.Add(udg);
                }

                ctx.SaveChanges();
            }
        }

        public static void SetUserDanceGroupsPaymentPermissions(int userID, List<DanceGroupModel> userDanceGroups)
        {
            using (var ctx = new DFAppEntities())
            {
                // first delete user dance groups payment ability info
                var ability = ctx.UserDanceGroups.Where(x => x.UserID == userID && x.HasPaymentAbility).ToList();
                if (ability.Count() > 0)
                {
                    for (int i = ability.Count() - 1; i >= 0; i--)
                    {
                        ability.ElementAt(i).HasPaymentAbility = false;
                    }
                }

                // add new payment ability info
                foreach (var group in userDanceGroups)
                {
                    var record = ctx.UserDanceGroups.Where(x => x.UserID == userID).FirstOrDefault();
                    if (record != null)
                    {
                        record.HasPaymentAbility = true;
                    }
                }

                ctx.SaveChanges();
            }
        }

        #endregion
    }
}
