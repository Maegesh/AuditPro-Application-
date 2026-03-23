namespace AuditManagement.API.Services.Interfaces;

public interface ICorrectiveActionService
{
    Task CreateActionAsync(CreateCorrectiveActionDto dto);

    Task<List<CorrectiveActionResponseDto>> GetActionsByObservation(int observationId);

    Task<byte[]> GetActionPdfAsync(int actionId);

    Task UpdateActionAsync(int actionId, UpdateCorrectiveActionDto dto);

    Task<List<CorrectiveActionResponseDto>> GetMyActionsAsync(int userId);

    Task UpdateActionStatusAsync(int actionId, UpdateActionStatusDto dto, int employeeId);
}