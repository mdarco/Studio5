//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DF.DB.DBModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserGroupPermissions
    {
        public int UserGroupID { get; set; }
        public int PermissionID { get; set; }
        public string Note { get; set; }
    
        public virtual UserGroups UserGroups { get; set; }
        public virtual Permissions Permissions { get; set; }
    }
}
