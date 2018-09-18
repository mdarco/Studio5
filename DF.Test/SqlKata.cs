using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SqlKata;
using SqlKata.Compilers;
using Dapper;
using DF.DB;
using DF.Models;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace DF.Test
{
    [TestClass]
    public class SqlKata
    {
        [TestMethod]
        public void GetMembers()
        {
            //var q = 
            //    new Query("Members")
            //        .Join("Lookup_AgeCategories", "Members.AgeCategoryID", "Lookup_AgeCategories.ID")
            //        .Join("ContactData", "Members.ContactDataID", "ContactData.ContactDataID")
            //        .Select("MemberID", "FirstName", "LastName", "IsActive", "IsCompetitor", "JMBG", "BirthDate", "BirthPlace", "AgeCategoryID", "Note", "ProfileImage")
            //        .SelectRaw("FirstName + ' ' + LastName as FullName")
            //        .SelectRaw("Lookup_AgeCategories.Name as AgeCategory")
            //        .SelectRaw("ContactData.Address, ContactData.Email, ContactData.Phone1, ContactData.Phone2, ContactData.Phone3")
            //        .Where("FirstName", "Maja")
            //        .Where("FirstName", "Test");

            //var compiler = new SqlServerCompiler();
            //SqlResult result = compiler.Compile(q);
            //string sql = result.Sql;

            //string connectionString = DALHelper.GetSqlConnectionStringFromEF();

            //List<MemberModel> members = new List<MemberModel>();

            //using (var connection = new SqlConnection(connectionString))
            //{
            //    members = connection.Query<MemberModel, ContactDataModel, MemberModel>(
            //        sql,
            //        (member, contactData) => {
            //            member.ContactData = contactData;
            //            return member;
            //        },
            //        splitOn: "Address"
            //    ).AsList();
            //}

            //Assert.IsTrue(!string.IsNullOrEmpty(sql));
        }
    }
}
