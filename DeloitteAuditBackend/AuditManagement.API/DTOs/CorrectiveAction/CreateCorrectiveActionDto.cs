using System;

public class CreateCorrectiveActionDto
{
    public int ObservationId { get; set; }

    public int AssignedToUserId { get; set; }

    public string ActionDescription { get; set; } = null!;

    public string RootCause { get; set; } = null!;

    public string ExpectedOutcome { get; set; } = null!;

    public DateTime DueDate { get; set; }

    public ActionStatus Status { get; set; }
}