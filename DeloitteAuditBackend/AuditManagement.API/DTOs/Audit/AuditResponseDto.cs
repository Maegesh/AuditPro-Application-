using System;

public class AuditResponseDto
{
    public int AuditId { get; set; }

    public string AuditName { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}