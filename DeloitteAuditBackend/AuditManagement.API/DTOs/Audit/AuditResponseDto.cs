using System;

public class AuditResponseDto
{
    public int AuditId { get; set; }

    public string AuditName { get; set; }

    public string Status { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}