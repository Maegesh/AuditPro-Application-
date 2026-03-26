using System;

public class ObservationResponseDto
{
    public int ObservationId { get; set; }

    public int AuditId { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string AreaOrLocation { get; set; } = null!;

    public string Finding { get; set; } = null!;

    public string RiskOrImpact { get; set; } = null!;

    public string Recommendation { get; set; } = null!;

    public string Severity { get; set; } = null!;

    public DateOnly? DueDate { get; set; }

    public string? ProofFilePath { get; set; }
}