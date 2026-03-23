using AuditManagement.API.Models;

namespace AuditManagement.API.Repositories.Interfaces;

public interface IAuditRepository
{
    Task AddAsync(Audit audit);

    Task<List<Audit>> GetAuditsByCreatorAsync(int userId);

    Task<List<Audit>> GetAuditsByAuditorAsync(int auditorId);

    Task<Audit?> GetByIdAsync(int auditId);

    Task UpdateAsync(Audit audit);
}