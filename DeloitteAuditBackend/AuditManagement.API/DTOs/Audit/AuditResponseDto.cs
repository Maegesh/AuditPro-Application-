using System;

public class AuditResponseDto
{
    public int AuditId { get; set; }

    public string AuditName { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string AuditorName { get; set; } = null!;

    public string AuditorEmail { get; set; } = null!;

    public string DepartmentName { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }
}