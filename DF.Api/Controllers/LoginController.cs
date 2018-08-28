using DF.DB;
using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/login")]
    public class LoginController : ApiController
    {
        [Route("")]
        [HttpPost]
        public LoginModel AuthenticateUser(LoginModel model)
        {
            byte[] data = Convert.FromBase64String(model.Password);
            string decodedPass = Encoding.UTF8.GetString(data);

            UserModel user = null;

            try
            {
                user = Login.AuthenticateUser(model.Username, decodedPass);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(
                    new HttpResponseMessage()
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        ReasonPhrase = ex.Message
                    });
            }

            if (user == null)
            {
                model.IsAuthenticated = false;
            }
            else
            {
                model.IsAuthenticated = true;
                model.UserID = user.UserID;

                // get user details
                model.Username = user.Username;
                model.FirstName = user.FirstName;
                model.LastName = user.LastName;
                model.FullName = user.FullName;

                // do not send user password back to font-end
                model.Password = string.Empty;

                // get user groups
                //List<UserGroupModel> userGroups = UserGroups.GetUserGroupsByUser(user.UserID);
                List<UserGroupModel> userGroups = user.UserGroups;
                model.UserGroups = userGroups.Select(ug => ug.UserGroupName).ToList();

                // get effective permissions
                model.EffectivePermissions = Users.GetEffectivePermissions(user.UserID);
            }

            return model;
        }
    }
}
