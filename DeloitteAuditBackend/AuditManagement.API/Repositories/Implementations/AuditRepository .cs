using AuditManagement.API.Data;
using AuditManagement.API.Models;
using AuditManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.API.Repositories.Implementations;

public class AuditRepository : IAuditRepository
{
    private readonly AuditSystemDbContext _context;

    public AuditRepository(AuditSystemDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Audit audit)
    {
        await _context.Audits.AddAsync(audit);
        await _context.SaveChangesAsync();
    }

    // Admin → audits created by him
    public async Task<List<Audit>> GetAuditsByCreatorAsync(int userId)
    {
        return await _context.Audits
            .Include(a => a.Auditor)
            .Include(a => a.Department)
            .Include(a => a.CreatedByUser)
            .Where(a => a.CreatedByUserId == userId && a.IsDeleted != true)
            .ToListAsync();
    }

    public async Task<List<Audit>> GetAuditsByAuditorAsync(int auditorId)
    {
        return await _context.Audits
            .Include(a => a.Auditor)
            .Include(a => a.Department)
            .Include(a => a.CreatedByUser)
            .Where(a => a.AuditorId == auditorId && a.IsDeleted != true)
            .ToListAsync();
    }

    public async Task<Audit?> GetByIdAsync(int auditId)
    {
        return await _context.Audits
            .FirstOrDefaultAsync(a => a.AuditId == auditId && a.IsDeleted != true);
    }

    public async Task UpdateAsync(Audit audit)
    {
        _context.Audits.Update(audit);
        await _context.SaveChangesAsync();
    }
}