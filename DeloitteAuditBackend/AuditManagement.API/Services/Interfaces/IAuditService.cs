namespace AuditManagement.API.Services.Interfaces;

public interface IAuditService
{
    Task CreateAuditAsync(CreateAuditDto dto, int createdByUserId);

    Task<List<AuditResponseDto>> GetAuditsForAdmin(int adminId);

    Task<List<AuditResponseDto>> GetAuditsForAuditor(int auditorId);

    Task SubmitAuditAsync(int auditId, int auditorId);

    Task ApproveAuditAsync(int auditId);
}