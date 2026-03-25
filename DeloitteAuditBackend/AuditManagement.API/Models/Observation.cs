using System;
using System.Collections.Generic;

namespace AuditManagement.API.Models;

public partial class Observation
{
    public int ObservationId { get; set; }

    public int AuditId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? AreaOrLocation { get; set; }

    public string? Finding { get; set; }

    public string? RiskOrImpact { get; set; }

    public string? Recommendation { get; set; }

    public string? Severity { get; set; }

    public DateOnly? DueDate { get; set; }

    public byte[]? ProofFileData { get; set; }

    public string? ProofFileName { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual Audit Audit { get; set; } = null!;

    public virtual ICollection<CorrectiveAction> CorrectiveActions { get; set; } = new List<CorrectiveAction>();
}
