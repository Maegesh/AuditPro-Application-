using AuditManagement.API.Models;

namespace AuditManagement.API.Repositories.Interfaces;

public interface IDepartmentRepository
{
    Task AddAsync(Department department);

    Task<List<Department>> GetAllAsync();
}
