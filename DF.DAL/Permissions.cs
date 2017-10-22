using DF.DB.DBModel;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class Permissions
    {
        public static List<PermissionModel> GetPermissions()
        {
            using (var ctx = new DFAppEntities())
            {
                return ctx.Permissions
                    .Select(u =>
                        new PermissionModel()
                        {
                            PermissionID = u.PermissionID,
                            PermissionName = u.PermissionName
                        }
                    )
                    .OrderBy(u => u.PermissionName)
                    .ToList();
            }
        }
    }
}
