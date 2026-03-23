namespace AuditManagement.API.Services.Interfaces;

public interface IObservationService
{
    Task AddObservationAsync(CreateObservationDto dto);

    Task<List<ObservationResponseDto>> GetObservationsByAuditId(int auditId);

    Task UpdateObservationAsync(int observationId, UpdateObservationDto dto);
}