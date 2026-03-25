using Microsoft.EntityFrameworkCore;
using AuditManagement.API.Data;
using AuditManagement.API.Models;
using AuditManagement.API.Repositories.Interfaces;

namespace AuditManagement.API.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly AuditSystemDbContext _context;

    public UserRepository(AuditSystemDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.IsDeleted != true);
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId && u.IsDeleted != true);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> GetAuditorsByDepartmentAsync(int departmentId)
    {
        return await _context.Users
            .Where(u => u.Role == "Auditor" && u.DepartmentId == departmentId && u.IsDeleted != true)
            .ToListAsync();
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users
            .Where(u => u.Role != "Admin" && u.IsDeleted != true)
            .ToListAsync();
    }
}