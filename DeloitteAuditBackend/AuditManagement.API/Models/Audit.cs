using System;
using System.Collections.Generic;

namespace AuditManagement.API.Models;

public partial class Audit
{
    public int AuditId { get; set; }

    public string? AuditCode { get; set; }

    public string AuditName { get; set; } = null!;

    public int DepartmentId { get; set; }

    public int AuditorId { get; set; }

    public int? CreatedByUserId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual User Auditor { get; set; } = null!;

    public virtual User? CreatedByUser { get; set; }

    public virtual Department Department { get; set; } = null!;

    public virtual ICollection<Observation> Observations { get; set; } = new List<Observation>();
}
