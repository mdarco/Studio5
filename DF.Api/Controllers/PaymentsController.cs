using DF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DF.Api.Controllers
{
    [RoutePrefix("api/payments")]
    public class PaymentsController : ApiController
    {
        [Route("filtered")]
        [HttpPost]
        public List<PaymentModel> GetFiltered(PaymentFilter filter)
        {
            return DB.Payments.GetPaymentsFiltered(filter);
        }

        [Route("{id}")]
        [HttpGet]
        public PaymentModel GetPayment(int id)
        {
            return DB.Payments.GetPayment(id);
        }

        [Route("")]
        [HttpPost]
        public void AddPayment(PaymentModel model)
        {
            try
            {
                DB.Payments.AddPayment(model);
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
        public void EditPayment(PaymentModel model)
        {
            try
            {
                DB.Payments.EditPayment(model);
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
        [HttpPost]
        public void ClonePayment(PaymentModel model)
        {
            try
            {
                DB.Payments.ClonePayment(model);
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
        [HttpDelete]
        public void DeletePayment(int id)
        {
            try
            {
                DB.Payments.DeletePayment(id);
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

        [Route("create-new-monthly-installments")]
        [HttpGet]
        public void CreateNewMonthlyInstallments()
        {
            DB.Payments.CreateNewMonthlyInstallments();
        }
    }
}
