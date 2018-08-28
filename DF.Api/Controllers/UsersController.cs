﻿using DF.DB;
using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/settings/users")]
    public class UsersController : ApiController
    {
        [Route("")]
        [HttpGet]
        public List<UserModel> GetUsers()
        {
            return Users.GetUsers();
        }

        //[Route("filter")]
        //[HttpPost]
        //public List<UserModel> GetUsersFiltered(UserFilterModel filter)
        //{
        //    return Users.GetUsersFilter(filter);
        //}

        //[Route("{id}")]
        //[HttpGet]
        //public UserModel GetIndividualUser(int id)
        //{
        //    return Users.GetIndividualUser(id);
        //}

        //[Route("")]
        //[HttpPost]
        //public void ManageUser(UserModel model)
        //{
        //    Users.ManageUser(model);
        //}

        //[Route("{id}")]
        //[HttpDelete]
        //public void DeleteUser(int id)
        //{
        //    Users.DeleteUser(id);
        //}

        //[Route("change-password")]
        //[HttpPost]
        //public void ChangePassword(UserModel model)
        //{
        //    Users.ChangePassword(model);
        //}

        //[Route("{id}/usergroups")]
        //[HttpGet]
        //public List<UserGroupModel> GetUserGroups(int id)
        //{
        //    return Users.GetUserGroups(id);
        //}

        #region User group members

        //[Route("{userID}/user-groups/{userGroupID}")]
        //[HttpDelete]
        //public void DeleteUserFromUserGroup(int userID, int userGroupID)
        //{
        //    Users.DeleteUserFromUserGroup(userID, userGroupID);
        //}

        //[Route("{userID}/user-groups")]
        //[HttpPost]
        //public void AddUserToUserGroups(int userID, List<UserGroupModel> userGroups)
        //{
        //    Users.AddUserToUserGroups(userID, userGroups);
        //}

        #endregion

        #region User permissions

        //[Route("permissions")]
        //[HttpGet]
        //public List<PermissionModel> GetPermissions()
        //{
        //    return Users.GetPermissions();
        //}

        //[Route("{id}/permissions")]
        //[HttpGet]
        //public List<PermissionModel> GetPermissions(int id)
        //{
        //    return Users.GetPermissions(id);
        //}

        //[Route("{id}/effective-permissions")]
        //[HttpGet]
        //public List<string> GetEffectivePermissions(int id)
        //{
        //    return Users.GetEffectivePermissions(id);
        //}

        //[Route("{userID}/permissions")]
        //[HttpPost]
        //public void AddUserPermissions(int userID, List<PermissionModel> permissions)
        //{
        //    Users.AddUserPermissions(userID, permissions);
        //}

        #endregion
    }
}