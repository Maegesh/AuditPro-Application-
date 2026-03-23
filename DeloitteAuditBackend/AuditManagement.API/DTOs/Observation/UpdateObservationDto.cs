public class UpdateObservationDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? AreaOrLocation { get; set; }

    public string? Finding { get; set; }

    public string? RiskOrImpact { get; set; }

    public string? Recommendation { get; set; }

    public Severity? Severity { get; set; }

    public DateTime? DueDate { get; set; }
}
