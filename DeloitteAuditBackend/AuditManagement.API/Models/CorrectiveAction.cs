using System;
using System.Collections.Generic;

namespace AuditManagement.API.Models;

public partial class CorrectiveAction
{
    public int ActionId { get; set; }

    public int ObservationId { get; set; }

    public int? AssignedToUserId { get; set; }

    public string? ActionDescription { get; set; }

    public string? RootCause { get; set; }

    public string? ExpectedOutcome { get; set; }

    public DateOnly? DueDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual User? AssignedToUser { get; set; }

    public virtual Observation Observation { get; set; } = null!;
}
