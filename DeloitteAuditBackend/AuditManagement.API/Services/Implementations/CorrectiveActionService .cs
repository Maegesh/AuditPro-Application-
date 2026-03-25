using AuditManagement.API.Repositories.Interfaces;
using AuditManagement.API.Services.Interfaces;
using AuditManagement.API.Models;
using Microsoft.Extensions.Logging;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace AuditManagement.API.Services.Implementations;

public class CorrectiveActionService : ICorrectiveActionService
{
    private readonly ICorrectiveActionRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly IObservationRepository _observationRepository;
    private readonly IAuditRepository _auditRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<CorrectiveActionService> _logger;

    public CorrectiveActionService(ICorrectiveActionRepository repository,
                                   IUserRepository userRepository,
                                   IObservationRepository observationRepository,
                                   IAuditRepository auditRepository,
                                   IEmailService emailService,
                                   ILogger<CorrectiveActionService> logger)
    {
        _repository = repository;
        _userRepository = userRepository;
        _observationRepository = observationRepository;
        _auditRepository = auditRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task CreateActionAsync(CreateCorrectiveActionDto dto)
    {
        _logger.LogInformation("Creating corrective action for ObservationId: {ObservationId}", dto.ObservationId);

        var action = new CorrectiveAction
        {
            ObservationId = dto.ObservationId,
            AssignedToUserId = dto.AssignedToUserId,
            ActionDescription = dto.ActionDescription,
            RootCause = dto.RootCause,
            ExpectedOutcome = dto.ExpectedOutcome,
            DueDate = DateOnly.FromDateTime(dto.DueDate),
            Status = dto.Status.ToString()
        };

        await _repository.AddAsync(action);

        _logger.LogInformation("Corrective action created successfully");

        if (dto.AssignedToUserId > 0)
        {
            var employee = await _userRepository.GetByIdAsync(dto.AssignedToUserId);
            var observation = await _observationRepository.GetByIdAsync(dto.ObservationId);

            if (employee != null && observation != null)
            {
                var body = $@"Dear {employee.Name},

A corrective action has been assigned to you on AuditPro.

Action Details:
  Observation   : {observation.Title}
  Description   : {dto.ActionDescription}
  Root Cause    : {dto.RootCause}
  Expected Outcome : {dto.ExpectedOutcome}
  Due Date      : {action.DueDate}
  Status        : {action.Status}

Please log in to AuditPro to review and take the necessary action before the due date.

Regards,
AuditPro System
Enterprise Audit Management

--
This is an automated message. Please do not reply to this email.
(c) {DateTime.UtcNow.Year} AuditPro. All rights reserved.";

                await _emailService.SendEmailAsync(employee.Email, "New Corrective Action Assigned to You", body);

                _logger.LogInformation("Assignment notification sent to employee: {Email}", employee.Email);
            }
        }
    }

    public async Task<List<CorrectiveActionResponseDto>> GetActionsByObservation(int observationId)
    {
        _logger.LogInformation("Fetching actions for ObservationId: {ObservationId}", observationId);

        var actions = await _repository.GetByObservationIdAsync(observationId);

        return actions.Select(a => new CorrectiveActionResponseDto
        {
            ActionId = a.ActionId,
            ObservationId = a.ObservationId,
            AssignedToUserId = a.AssignedToUserId,
            ActionDescription = a.ActionDescription,
            RootCause = a.RootCause,
            ExpectedOutcome = a.ExpectedOutcome,
            DueDate = a.DueDate,
            Status = a.Status
        }).ToList();
    }

    public async Task<byte[]> GetActionPdfAsync(int actionId)
    {
        _logger.LogInformation("Generating PDF for ActionId: {ActionId}", actionId);

        var action = await _repository.GetByIdAsync(actionId);

        if (action == null)
        {
            _logger.LogWarning("Corrective action not found: {ActionId}", actionId);
            throw new Exception("Corrective action not found");
        }

        QuestPDF.Settings.License = LicenseType.Community;

        var pdf = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Text("Corrective Action Report")
                    .SemiBold().FontSize(18).FontColor(Colors.Blue.Darken2);

                page.Content().PaddingTop(20).Column(col =>
                {
                    col.Spacing(10);

                    col.Item().Text($"Action ID: {action.ActionId}").SemiBold();
                    col.Item().Text($"Observation ID: {action.ObservationId}");
                    col.Item().Text($"Assigned To User ID: {action.AssignedToUserId}");
                    col.Item().Text($"Status: {action.Status}");
                    col.Item().Text($"Due Date: {action.DueDate}");

                    col.Item().PaddingTop(10).Text("Action Description").SemiBold().FontSize(13);
                    col.Item().Text(action.ActionDescription ?? "-");

                    col.Item().PaddingTop(10).Text("Root Cause").SemiBold().FontSize(13);
                    col.Item().Text(action.RootCause ?? "-");

                    col.Item().PaddingTop(10).Text("Expected Outcome").SemiBold().FontSize(13);
                    col.Item().Text(action.ExpectedOutcome ?? "-");
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Generated on ");
                    x.Span(DateTime.UtcNow.ToString("dd MMM yyyy")).SemiBold();
                });
            });
        });

        return pdf.GeneratePdf();
    }

    public async Task UpdateActionAsync(int actionId, UpdateCorrectiveActionDto dto)
    {
        _logger.LogInformation("Updating corrective action ID: {ActionId}", actionId);

        var action = await _repository.GetByIdAsync(actionId);

        if (action == null)
        {
            _logger.LogWarning("Corrective action not found: {ActionId}", actionId);
            throw new Exception("Corrective action not found");
        }

        if (!string.IsNullOrWhiteSpace(dto.ActionDescription)) action.ActionDescription = dto.ActionDescription;
        if (!string.IsNullOrWhiteSpace(dto.RootCause)) action.RootCause = dto.RootCause;
        if (!string.IsNullOrWhiteSpace(dto.ExpectedOutcome)) action.ExpectedOutcome = dto.ExpectedOutcome;
        if (dto.DueDate.HasValue) action.DueDate = DateOnly.FromDateTime(dto.DueDate.Value);
        if (dto.Status.HasValue) action.Status = dto.Status.ToString();

        action.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(action);

        _logger.LogInformation("Corrective action updated successfully: {ActionId}", actionId);

        if (action.AssignedToUserId.HasValue)
        {
            var employee = await _userRepository.GetByIdAsync(action.AssignedToUserId.Value);

            if (employee != null)
            {
                var body = $@"Hello {employee.Name},<br/><br/>
                    The corrective action assigned to you has been updated.<br/><br/>
                    <b>Action ID:</b> {action.ActionId}<br/>
                    <b>Description:</b> {action.ActionDescription}<br/>
                    <b>Root Cause:</b> {action.RootCause}<br/>
                    <b>Expected Outcome:</b> {action.ExpectedOutcome}<br/>
                    <b>Due Date:</b> {action.DueDate}<br/>
                    <b>Status:</b> {action.Status}<br/><br/>
                    Please log in to view the full details.";

                await _emailService.SendEmailAsync(employee.Email, "Corrective Action Updated", body);

                _logger.LogInformation("Update notification sent to employee: {Email}", employee.Email);
            }
        }
    }

    public async Task<List<CorrectiveActionResponseDto>> GetMyActionsAsync(int userId)
    {
        _logger.LogInformation("Fetching corrective actions for Employee: {UserId}", userId);

        var actions = await _repository.GetByAssignedUserIdAsync(userId);

        return actions.Select(a => new CorrectiveActionResponseDto
        {
            ActionId = a.ActionId,
            ObservationId = a.ObservationId,
            AssignedToUserId = a.AssignedToUserId,
            ActionDescription = a.ActionDescription,
            RootCause = a.RootCause,
            ExpectedOutcome = a.ExpectedOutcome,
            DueDate = a.DueDate,
            Status = a.Status,
            ProofFileData = a.Observation?.ProofFileData != null ? Convert.ToBase64String(a.Observation.ProofFileData) : null,
            ProofFileName = a.Observation?.ProofFileName
        }).ToList();
    }

    public async Task UpdateActionStatusAsync(int actionId, UpdateActionStatusDto dto, int employeeId)
    {
        _logger.LogInformation("Employee {EmployeeId} updating status for ActionId: {ActionId}", employeeId, actionId);

        var action = await _repository.GetByIdAsync(actionId);

        if (action == null || action.AssignedToUserId != employeeId)
        {
            _logger.LogWarning("Action not found or not assigned to Employee: {EmployeeId}", employeeId);
            throw new Exception("Corrective action not found or not assigned to you");
        }

        action.Status = dto.Status.ToString();
        action.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(action);

        _logger.LogInformation("Status updated for ActionId: {ActionId}", actionId);

        var observation = await _observationRepository.GetByIdAsync(action.ObservationId);
        if (observation == null) return;

        var audit = await _auditRepository.GetByIdAsync(observation.AuditId);
        if (audit == null) return;

        var auditor = await _userRepository.GetByIdAsync(audit.AuditorId);
        if (auditor == null) return;

        var employee = await _userRepository.GetByIdAsync(employeeId);

        var body = $@"Hello {auditor.Name},<br/><br/>
            The corrective action status has been updated by employee <b>{employee?.Name}</b>.<br/><br/>
            <b>Action ID:</b> {action.ActionId}<br/>
            <b>Description:</b> {action.ActionDescription}<br/>
            <b>New Status:</b> {action.Status}<br/>
            <b>Due Date:</b> {action.DueDate}<br/><br/>
            Please log in to review the progress.";

        await _emailService.SendEmailAsync(auditor.Email, "Corrective Action Status Updated", body);

        _logger.LogInformation("Status update notification sent to auditor: {Email}", auditor.Email);
    }
}
