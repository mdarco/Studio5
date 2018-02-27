﻿using DF.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/members")]
    public class MembersController : ApiController
    {
        [Route("filtered")]
        [HttpPost]
        public ApiTableResponseModel<MemberModel> GetFilteredMembers(MemberFilterModel filter)
        {
            return DB.Members.GetFilteredMembers(filter);
        }

        [Route("{id}")]
        [HttpGet]
        public MemberModel GetMember(int id)
        {
            return DB.Members.GetMember(id);
        }

        [Route("")]
        [HttpPost]
        public void CreateMember(MemberModel model)
        {
            try
            {
                DB.Members.CreateMember(model);
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
        }

        [Route("{id}")]
        [HttpPut]
        public void EditMember(int id, MemberModel model)
        {
            try
            {
                DB.Members.EditMember(id, model);
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
        }

        #region Documents

        [Route("{id}/documents")]
        [HttpGet]
        public List<DocumentModel> GetDocuments(int id)
        {
            return DB.Members.GetDocuments(id);
        }

        [Route("{id}/documents")]
        [HttpPost]
        public void AddDocument(MemberDocumentModel model)
        {
            try
            {
                BL.Members.InsertDocument(model);
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
        }

        [Route("{id}/documents/{documentID}")]
        [HttpDelete]
        public void DeleteDocument(int id, int documentID)
        {
            try
            {
                BL.Members.DeleteDocument(documentID);
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
        }

        #endregion

        #region Dance groups

        [Route("{id}/dance-groups")]
        [HttpGet]
        public List<DanceGroupModel> GetDanceGroups(int id)
        {
            return DB.Members.GetDanceGroups(id);
        }

        [Route("{id}/dance-groups")]
        [HttpPost]
        public void UpdateDanceGroups(int id, List<MemberDanceGroupModel> model)
        {
            try
            {
                DB.Members.UpdateDanceGroups(id, model);
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
        }

        #endregion

        #region Payments

        [Route("{id}/payments")]
        [HttpGet]
        public List<MemberPaymentModel> GetMemberPayments(int id)
        {
            return DB.Members.GetMemberPayments(id);
        }

        [Route("{id}/payments/{paymentID}/installments")]
        [HttpGet]
        public List<InstallmentModel> GetMemberPaymentInstallments(int id, int paymentID)
        {
            return DB.Members.GetMemberPaymentInstallments(id, paymentID);
        }

        [Route("{id}/payments")]
        [HttpPost]
        public void AddMemberPayment(int id, MemberPaymentModel model)
        {
            BL.Members.AddMemberPayment(id, model);
        }

        [Route("{id}/payments/{paymentID}")]
        [HttpDelete]
        public void DeleteMemberPayment(int id, int paymentID)
        {
            try
            {
                DB.Members.DeleteMemberPayment(id, paymentID);
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
        }

        [Route("{id}/payments/{paymentID}/installments/{installmentID}")]
        [HttpPut]
        public void EditMemberPaymentInstallment(int installmentID, InstallmentModel model)
        {
            DB.Members.EditMemberPaymentInstallment(installmentID, model);
        }

        #endregion
    }
}
