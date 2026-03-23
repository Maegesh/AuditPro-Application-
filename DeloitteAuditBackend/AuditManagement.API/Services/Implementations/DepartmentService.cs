using AuditManagement.API.Models;
using AuditManagement.API.Repositories.Interfaces;
using AuditManagement.API.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace AuditManagement.API.Services.Implementations;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;
    private readonly ILogger<DepartmentService> _logger;

    public DepartmentService(IDepartmentRepository repository, ILogger<DepartmentService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task CreateDepartmentAsync(CreateDepartmentDto dto)
    {
        _logger.LogInformation("Creating department: {DepartmentName}", dto.DepartmentName);

        var department = new Department
        {
            DepartmentName = dto.DepartmentName
        };

        await _repository.AddAsync(department);

        _logger.LogInformation("Department created successfully: {DepartmentName}", dto.DepartmentName);
    }

    public async Task<List<DepartmentResponseDto>> GetAllDepartmentsAsync()
    {
        _logger.LogInformation("Fetching all departments");

        var departments = await _repository.GetAllAsync();

        return departments.Select(d => new DepartmentResponseDto
        {
            DepartmentId = d.DepartmentId,
            DepartmentName = d.DepartmentName
        }).ToList();
    }
}
