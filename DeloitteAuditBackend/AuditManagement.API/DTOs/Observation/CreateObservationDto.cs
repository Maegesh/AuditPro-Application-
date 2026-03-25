using Microsoft.AspNetCore.Http;

public class CreateObservationDto
{
    public int AuditId { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string AreaOrLocation { get; set; } = null!;
    public string Finding { get; set; } = null!;
    public string RiskOrImpact { get; set; } = null!;
    public string Recommendation { get; set; } = null!;
    public Severity Severity { get; set; }
    public DateTime DueDate { get; set; }
    public IFormFile? ProofFile { get; set; }
}
