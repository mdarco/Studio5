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
    
    public partial class Payments
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Payments()
        {
            this.MemberPayments = new HashSet<MemberPayments>();
            this.MemberPaymentsForCompanions = new HashSet<MemberPaymentsForCompanions>();
            this.MemberPaymentInstallments = new HashSet<MemberPaymentInstallments>();
        }
    
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Currency { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public System.DateTime DueDate { get; set; }
        public Nullable<System.DateTime> StopDate { get; set; }
        public Nullable<int> NumberOfInstallments { get; set; }
        public string InstallmentAmounts { get; set; }
        public Nullable<decimal> AmountForCompanion { get; set; }
        public string InstallmentAmountsForCompanion { get; set; }
        public bool Active { get; set; }
        public Nullable<int> EventID { get; set; }
        public Nullable<int> CostumeID { get; set; }
        public Nullable<int> OutfitID { get; set; }
    
        public virtual Costumes Costumes { get; set; }
        public virtual Events Events { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MemberPayments> MemberPayments { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MemberPaymentsForCompanions> MemberPaymentsForCompanions { get; set; }
        public virtual Outfits Outfits { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MemberPaymentInstallments> MemberPaymentInstallments { get; set; }
    }
}
