public class CorrectiveActionResponseDto
{
    public int ActionId { get; set; }

    public int ObservationId { get; set; }

    public int? AssignedToUserId { get; set; }

    public string? ActionDescription { get; set; }

    public string? RootCause { get; set; }

    public string? ExpectedOutcome { get; set; }

    public DateOnly? DueDate { get; set; }

    public string? Status { get; set; }

    public string? ProofFilePath { get; set; }
}
