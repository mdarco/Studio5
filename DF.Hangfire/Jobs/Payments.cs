using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace DF.Hangfire.Jobs
{
    public static class Payments
    {
        public static void CreateNewMonthlyInstallments()
        {
            string dfApiBaseAddress = ConfigurationManager.AppSettings["df:ApiBaseAddress"].ToString();
            string dfCreateNewMonthlyInstallmentsEndpoint = ConfigurationManager.AppSettings["df:CreateNewMonthlyInstallmentsEndpoint"].ToString();

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(dfApiBaseAddress);

            HttpResponseMessage response = client.GetAsync(dfCreateNewMonthlyInstallmentsEndpoint).Result; // '.Result' makes this synchronous
            if (response.IsSuccessStatusCode)
            {
                // TODO: log success...
            }
            else
            {
                // TODO: log error...
            }
        }
    }
}
