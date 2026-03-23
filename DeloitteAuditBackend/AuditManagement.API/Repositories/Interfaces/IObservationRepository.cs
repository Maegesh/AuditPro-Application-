using AuditManagement.API.Models;

namespace AuditManagement.API.Repositories.Interfaces;

public interface IObservationRepository
{
    Task AddAsync(Observation observation);

    Task<List<Observation>> GetByAuditIdAsync(int auditId);

    Task<Observation?> GetByIdAsync(int observationId);

    Task UpdateAsync(Observation observation);
}