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
    
    public partial class TrainingSchedules
    {
        public int ID { get; set; }
        public int TrainingLocationID { get; set; }
        public string WeekDay { get; set; }
        public System.TimeSpan StartTime { get; set; }
        public System.TimeSpan EndTime { get; set; }
        public string Note { get; set; }
        public bool Active { get; set; }
    
        public virtual Locations Locations { get; set; }
    }
}
