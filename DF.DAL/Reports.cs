using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DF.Models;

namespace DF.DB
{
    public static class Reports
    {
        private static readonly string connectionString = DALHelper.GetSqlConnectionStringFromEF();

        public static List<ReportInstallment> GetUnpaidInstallmentsByPeriod(DateTime? startDate, DateTime? endDate)
        {
            string spName = "dbo.getUnpaidInstallmentsByPeriod";

            List<ReportInstallment> installments = new List<ReportInstallment>();

            using (var connection = new SqlConnection(connectionString))
            {
                var spParams = new DynamicParameters();
                spParams.Add("@startDate", startDate, dbType: System.Data.DbType.DateTime);
                spParams.Add("@endDate", endDate, dbType: System.Data.DbType.DateTime);

                installments = connection.Query<ReportInstallment>(spName, spParams, commandType: System.Data.CommandType.StoredProcedure).ToList();
            }

            return installments;
        }
    }
}
