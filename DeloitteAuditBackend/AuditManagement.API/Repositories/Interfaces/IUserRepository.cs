using AuditManagement.API.Models;

namespace AuditManagement.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User> GetByEmailAsync(string email);

    Task AddAsync(User user);

    Task<User> GetByIdAsync(int userId);

    Task UpdateAsync(User user);

    Task<List<User>> GetAuditorsByDepartmentAsync(int departmentId);

    Task<List<User>> GetAllUsersAsync();
}