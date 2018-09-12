using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Core.EntityClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DF.DB
{
    public static class DALHelper
    {
        public static string GetSqlConnectionStringFromEF()
        {
            return new EntityConnectionStringBuilder(ConfigurationManager.ConnectionStrings["DFAppEntities"].ConnectionString).ProviderConnectionString;
        }
    }
}
