using System;

public class CreateAuditDto
{
    public string AuditName { get; set; }

    public int DepartmentId { get; set; }

    public int AuditorId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public AuditStatus Status { get; set; }
}