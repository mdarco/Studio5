using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Hangfire;
using System.Configuration;
using System.Diagnostics;

[assembly: OwinStartup(typeof(DF.Hangfire.Startup))]

namespace DF.Hangfire
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            GlobalConfiguration.Configuration
                .UseSqlServerStorage(ConfigurationManager.ConnectionStrings["DFAppEntities"].ConnectionString);

            app.UseHangfireDashboard("/dashboard");
            app.UseHangfireServer();

            // Job: creating new monthly installments --> fired every first day of the month
            RecurringJob.AddOrUpdate(() => Jobs.Payments.CreateNewMonthlyInstallments(), Cron.Monthly(1));
        }
    }
}
