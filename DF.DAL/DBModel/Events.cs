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
    
    public partial class Events
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Events()
        {
            this.EventChoreographies = new HashSet<EventChoreographies>();
            this.Performances = new HashSet<Performances>();
            this.Payments = new HashSet<Payments>();
        }
    
        public int EventID { get; set; }
        public string EventName { get; set; }
        public string EventDesc { get; set; }
        public Nullable<int> Lookup_EventTypeID { get; set; }
        public Nullable<System.DateTime> EventDate { get; set; }
        public string EventLocation { get; set; }
        public string EventTransportationType { get; set; }
        public Nullable<decimal> EventCost { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EventChoreographies> EventChoreographies { get; set; }
        public virtual Lookup_EventTypes Lookup_EventTypes { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Performances> Performances { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Payments> Payments { get; set; }
    }
}
