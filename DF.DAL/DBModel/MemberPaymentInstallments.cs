//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DF.DB.DBModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class MemberPaymentInstallments
    {
        public int ID { get; set; }
        public int MemberID { get; set; }
        public int PaymentID { get; set; }
        public System.DateTime InstallmentDate { get; set; }
        public decimal Amount { get; set; }
        public bool IsPaid { get; set; }
        public Nullable<System.DateTime> PaymentDate { get; set; }
        public string Note { get; set; }
        public bool IsCanceled { get; set; }
    
        public virtual Members Members { get; set; }
        public virtual Payments Payments { get; set; }
    }
}
