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

            RecurringJob.AddOrUpdate(() => Debug.WriteLine("Minutely Job"), Cron.Monthly(1));
        }
    }
}
