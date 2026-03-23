namespace AuditManagement.API.Services.Interfaces;

public interface IDepartmentService
{
    Task CreateDepartmentAsync(CreateDepartmentDto dto);

    Task<List<DepartmentResponseDto>> GetAllDepartmentsAsync();
}
