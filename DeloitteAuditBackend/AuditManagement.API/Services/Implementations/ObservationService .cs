using AuditManagement.API.Repositories.Interfaces;
using AuditManagement.API.Services.Interfaces;
using AuditManagement.API.Models;
using AuditManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AuditManagement.API.Services.Implementations;

public class ObservationService : IObservationService
{
    private readonly IObservationRepository _observationRepository;
    private readonly AuditSystemDbContext _context;
    private readonly ILogger<ObservationService> _logger;

    public ObservationService(IObservationRepository observationRepository,
                              AuditSystemDbContext context,
                              ILogger<ObservationService> logger)
    {
        _observationRepository = observationRepository;
        _context = context;
        _logger = logger;
    }

    public async Task AddObservationAsync(CreateObservationDto dto)
    {
        _logger.LogInformation("Adding observation for AuditId: {AuditId}", dto.AuditId);

        var auditExists = await _context.Audits
            .AnyAsync(a => a.AuditId == dto.AuditId && a.IsDeleted != true);

        if (!auditExists)
        {
            _logger.LogWarning("Audit not found for ID: {AuditId}", dto.AuditId);
            throw new Exception("Audit not found");
        }

        var observation = new Observation
        {
            AuditId = dto.AuditId,
            Title = dto.Title,
            Description = dto.Description,
            AreaOrLocation = dto.AreaOrLocation,
            Finding = dto.Finding,
            RiskOrImpact = dto.RiskOrImpact,
            Recommendation = dto.Recommendation,
            Severity = dto.Severity.ToString(),
            DueDate = DateOnly.FromDateTime(dto.DueDate)
        };

        await _observationRepository.AddAsync(observation);

        _logger.LogInformation("Observation added successfully for AuditId: {AuditId}", dto.AuditId);
    }

    public async Task<List<ObservationResponseDto>> GetObservationsByAuditId(int auditId)
    {
        var observations = await _observationRepository.GetByAuditIdAsync(auditId);

        return observations.Select(o => new ObservationResponseDto
        {
            ObservationId = o.ObservationId,
            AuditId = o.AuditId,
            Title = o.Title,
            Description = o.Description,
            AreaOrLocation = o.AreaOrLocation,
            Finding = o.Finding,
            RiskOrImpact = o.RiskOrImpact,
            Recommendation = o.Recommendation,
            Severity = o.Severity,
            DueDate = o.DueDate
        }).ToList();
    }

    public async Task UpdateObservationAsync(int observationId, UpdateObservationDto dto)
    {
        _logger.LogInformation("Updating observation ID: {ObservationId}", observationId);

        var observation = await _observationRepository.GetByIdAsync(observationId);

        if (observation == null)
        {
            _logger.LogWarning("Observation not found: {ObservationId}", observationId);
            throw new Exception("Observation not found");
        }

        if (!string.IsNullOrWhiteSpace(dto.Title)) observation.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Description)) observation.Description = dto.Description;
        if (!string.IsNullOrWhiteSpace(dto.AreaOrLocation)) observation.AreaOrLocation = dto.AreaOrLocation;
        if (!string.IsNullOrWhiteSpace(dto.Finding)) observation.Finding = dto.Finding;
        if (!string.IsNullOrWhiteSpace(dto.RiskOrImpact)) observation.RiskOrImpact = dto.RiskOrImpact;
        if (!string.IsNullOrWhiteSpace(dto.Recommendation)) observation.Recommendation = dto.Recommendation;
        if (dto.Severity.HasValue) observation.Severity = dto.Severity.ToString();
        if (dto.DueDate.HasValue) observation.DueDate = DateOnly.FromDateTime(dto.DueDate.Value);

        observation.UpdatedAt = DateTime.UtcNow;

        await _observationRepository.UpdateAsync(observation);

        _logger.LogInformation("Observation updated successfully: {ObservationId}", observationId);
    }
}
