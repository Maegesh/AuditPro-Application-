using AuditManagement.API.Repositories.Interfaces;
using AuditManagement.API.Services.Interfaces;
using AuditManagement.API.Models;
using Microsoft.Extensions.Logging;

namespace AuditManagement.API.Services.Implementations;

public class AuditService : IAuditService
{
    private readonly IAuditRepository _auditRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuditService> _logger;

    public AuditService(IAuditRepository auditRepository,
                        IUserRepository userRepository,
                        IEmailService emailService,
                        ILogger<AuditService> logger)
    {
        _auditRepository = auditRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task CreateAuditAsync(CreateAuditDto dto, int createdByUserId)
    {
        _logger.LogInformation("Creating audit: {AuditName}", dto.AuditName);

        var audit = new Audit
        {
            AuditName = dto.AuditName,
            DepartmentId = dto.DepartmentId,
            AuditorId = dto.AuditorId,
            StartDate = DateOnly.FromDateTime(dto.StartDate),
            EndDate = DateOnly.FromDateTime(dto.EndDate),
            Status = dto.Status.ToString(),
            CreatedByUserId = createdByUserId
        };

        await _auditRepository.AddAsync(audit);

        _logger.LogInformation("Audit created successfully: {AuditName}", dto.AuditName);
    }

    public async Task<List<AuditResponseDto>> GetAuditsForAdmin(int adminId)
    {
        _logger.LogInformation("Fetching audits for Admin: {AdminId}", adminId);

        var audits = await _auditRepository.GetAuditsByCreatorAsync(adminId);

        return audits.Select(a => new AuditResponseDto
        {
            AuditId = a.AuditId,
            AuditName = a.AuditName,
            Status = a.Status,
            StartDate = a.StartDate,
            EndDate = a.EndDate
        }).ToList();
    }

    public async Task<List<AuditResponseDto>> GetAuditsForAuditor(int auditorId)
    {
        _logger.LogInformation("Fetching audits for Auditor: {AuditorId}", auditorId);

        var audits = await _auditRepository.GetAuditsByAuditorAsync(auditorId);

        return audits.Select(a => new AuditResponseDto
        {
            AuditId = a.AuditId,
            AuditName = a.AuditName,
            Status = a.Status,
            StartDate = a.StartDate,
            EndDate = a.EndDate
        }).ToList();
    }

    public async Task SubmitAuditAsync(int auditId, int auditorId)
    {
        _logger.LogInformation("Auditor {AuditorId} submitting AuditId: {AuditId} for approval", auditorId, auditId);

        var audit = await _auditRepository.GetByIdAsync(auditId);

        if (audit == null || audit.AuditorId != auditorId)
        {
            _logger.LogWarning("Audit not found or not assigned to Auditor: {AuditorId}", auditorId);
            throw new Exception("Audit not found or not assigned to you");
        }

        audit.Status = AuditStatus.PendingApproval.ToString();
        audit.UpdatedAt = DateTime.UtcNow;

        await _auditRepository.UpdateAsync(audit);

        _logger.LogInformation("Audit {AuditId} submitted for approval", auditId);
    }

    public async Task ApproveAuditAsync(int auditId)
    {
        _logger.LogInformation("Admin approving AuditId: {AuditId}", auditId);

        var audit = await _auditRepository.GetByIdAsync(auditId);

        if (audit == null)
        {
            _logger.LogWarning("Audit not found: {AuditId}", auditId);
            throw new Exception("Audit not found");
        }

        audit.Status = AuditStatus.Completed.ToString();
        audit.UpdatedAt = DateTime.UtcNow;

        await _auditRepository.UpdateAsync(audit);

        _logger.LogInformation("Audit {AuditId} approved as completed", auditId);

        var auditor = await _userRepository.GetByIdAsync(audit.AuditorId);
        if (auditor == null) return;

        var body = $@"Hello {auditor.Name},<br/><br/>
            Your submitted audit has been approved and marked as <b>Completed</b>.<br/><br/>
            <b>Audit ID:</b> {audit.AuditId}<br/>
            <b>Audit Name:</b> {audit.AuditName}<br/><br/>
            Thank you for your work.";

        await _emailService.SendEmailAsync(auditor.Email, "Audit Approved", body);

        _logger.LogInformation("Approval notification sent to auditor: {Email}", auditor.Email);
    }
}
