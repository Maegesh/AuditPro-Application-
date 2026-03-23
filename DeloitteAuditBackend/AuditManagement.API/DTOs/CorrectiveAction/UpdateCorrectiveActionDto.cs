public class UpdateCorrectiveActionDto
{
    public string? ActionDescription { get; set; }

    public string? RootCause { get; set; }

    public string? ExpectedOutcome { get; set; }

    public DateTime? DueDate { get; set; }

    public ActionStatus? Status { get; set; }
}
