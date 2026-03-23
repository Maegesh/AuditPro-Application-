using System;

public class ObservationResponseDto
{
    public int ObservationId { get; set; }

    public int AuditId { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string AreaOrLocation { get; set; }

    public string Finding { get; set; }

    public string RiskOrImpact { get; set; }

    public string Recommendation { get; set; }

    public string Severity { get; set; }

    public DateOnly? DueDate { get; set; }
}