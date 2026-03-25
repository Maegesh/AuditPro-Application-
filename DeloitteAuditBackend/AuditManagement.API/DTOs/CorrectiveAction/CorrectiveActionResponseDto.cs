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

    public string? ProofFileData { get; set; }  // Base64 encoded

    public string? ProofFileName { get; set; }
}
