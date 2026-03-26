using AuditManagement.API.Data;
using AuditManagement.API.Models;
using AuditManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuditManagement.API.Repositories.Implementations;

public class CorrectiveActionRepository : ICorrectiveActionRepository
{
    private readonly AuditSystemDbContext _context;

    public CorrectiveActionRepository(AuditSystemDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CorrectiveAction action)
    {
        await _context.CorrectiveActions.AddAsync(action);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CorrectiveAction>> GetByObservationIdAsync(int observationId)
    {
        return await _context.CorrectiveActions
            .Where(a => a.ObservationId == observationId && a.IsDeleted != true)
            .ToListAsync();
    }

    public async Task<CorrectiveAction?> GetByIdAsync(int actionId)
    {
        return await _context.CorrectiveActions
            .Include(a => a.Observation)
            .FirstOrDefaultAsync(a => a.ActionId == actionId && a.IsDeleted != true);
    }

    public async Task UpdateAsync(CorrectiveAction action)
    {
        _context.CorrectiveActions.Update(action);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CorrectiveAction>> GetByAssignedUserIdAsync(int userId)
    {
        return await _context.CorrectiveActions
            .Include(a => a.Observation)
            .Where(a => a.AssignedToUserId == userId && a.IsDeleted != true)
            .ToListAsync();
    }
}