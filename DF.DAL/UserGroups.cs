using DF.DB.DBModel;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class UserGroups
    {
        public static List<UserGroupModel> GetUserGroups()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserGroups
                            .Select(u =>
                                new UserGroupModel()
                                {
                                    UserGroupID = u.UserGroupID,
                                    UserGroupName = u.UserGroupName
                                }
                            )
                            .OrderBy(u => u.UserGroupName)
                            .ToList();
            }
        }

        public static List<UserGroupModel> GetUserGroupsByUser(int userID)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserGroupMembers.Include("UserGroups")
                    .Where(u => u.UserID == userID)
                    .Select(u =>
                        new UserGroupModel()
                        {
                            UserGroupID = u.UserGroupID,
                            UserGroupName = u.UserGroups.UserGroupName
                        }
                    )
                    .OrderBy(x => x.UserGroupName)
                    .ToList();
            }
        }

        public static void ManageUserGroup(UserGroupModel model)
        {
            if (model.UserGroupID == -1 || model.UserGroupID == 0)
            {
                AddUserGroup(model);
            }
            else
            {
                EditUserGroup(model);
            }
        }

        private static int AddUserGroup(UserGroupModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var existing = ctx.UserGroups.FirstOrDefault(x => x.UserGroupName.ToLower() == model.UserGroupName.ToLower());
                if (existing != null)
                {
                    throw new Exception("error_user_groups_name_exists");
                }

                DBModel.UserGroups ug = new DBModel.UserGroups();
                ug.UserGroupID = model.UserGroupID;
                ug.UserGroupName = model.UserGroupName;

                ctx.UserGroups.Add(ug);
                ctx.SaveChanges();

                return ug.UserGroupID;
            }
        }

        private static void EditUserGroup(UserGroupModel model)
        {
            using (var ctx = new DFAppEntities())
            {
                var userGroup = ctx.UserGroups.FirstOrDefault(ug => ug.UserGroupID == model.UserGroupID);
                if (userGroup != null)
                {
                    var existing = ctx.UserGroups.FirstOrDefault(x => x.UserGroupName.ToLower() == model.UserGroupName.ToLower());
                    if (existing != null)
                    {
                        throw new Exception("error_user_groups_name_exists");
                    }

                    userGroup.UserGroupName = model.UserGroupName;
                    ctx.SaveChanges();
                }
            }
        }

        public static void DeleteUserGroup(int id)
        {
            using (var ctx = new DFAppEntities())
            {
                var userGroup = ctx.UserGroups.FirstOrDefault(ug => ug.UserGroupID == id);
                if (userGroup != null)
                {
                    ctx.UserGroups.Remove(userGroup);
                    ctx.SaveChanges();
                }
            }
        }

        public static List<UserModel> GetAllUsersInGroup(int userGroupID)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserGroupMembers
                            .Include("Users")
                            .Where(x => x.UserGroupID == userGroupID)
                            .Select(x =>
                                new UserModel()
                                {
                                    UserID = x.UserID,
                                    Username = x.Users.Username,
                                    FirstName = x.Users.FirstName,
                                    LastName = x.Users.LastName,
                                    FullName = x.Users.FirstName + " " + x.Users.LastName
                                }
                            )
                            .OrderBy(x => x.FullName)
                            .ToList();
            }
        }

        #region User group permissions

        public static List<PermissionModel> GetPermissions(int userGroupID)
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.UserGroupPermissions.Include("Permissions").Where(ugp => ugp.UserGroupID == userGroupID)
                        .Select(ugp =>
                            new PermissionModel()
                            {
                                PermissionID = ugp.PermissionID,
                                PermissionName = ugp.Permissions.PermissionName
                            }
                        )
                        .OrderBy(p => p.PermissionName)
                        .ToList();
            }
        }

        public static void DeleteAllPermissionsByUserGroup(int userGroupID)
        {
            using (var ctx = new DFAppEntities())
            {
                var ugp = ctx.UserGroupPermissions.Where(u => u.UserGroupID == userGroupID).ToList();
                if (ugp.Count() > 0)
                {
                    foreach (UserGroupPermissions gp in ugp)
                    {
                        ctx.UserGroupPermissions.Remove(gp);
                        ctx.SaveChanges();
                    }
                }
            }
        }

        public static void AddUserGroupPermissions(int userGroupID, List<PermissionModel> permissions)
        {
            for (int i = 0; i < permissions.Count; i++)
            {
                int curentUserGroupPermissionID = permissions[i].PermissionID;
                AddUserGroupPermission(userGroupID, curentUserGroupPermissionID);
            }
        }

        private static void AddUserGroupPermission(int userGroupID, int curentUserGroupPermissionID)
        {
            using (var ctx = new DFAppEntities())
            {
                var user = ctx.UserGroups.Where(u => u.UserGroupID == userGroupID).FirstOrDefault();
                var permission = ctx.Permissions.Where(ug => ug.PermissionID == curentUserGroupPermissionID).FirstOrDefault();

                if (user != null && permission != null)
                {
                    UserGroupPermissions ugp = new UserGroupPermissions();
                    ugp.PermissionID = curentUserGroupPermissionID;
                    ugp.UserGroupID = userGroupID;

                    user.UserGroupPermissions.Add(ugp);
                    ctx.SaveChanges();
                }
            }
        }

        #endregion
    }
}
