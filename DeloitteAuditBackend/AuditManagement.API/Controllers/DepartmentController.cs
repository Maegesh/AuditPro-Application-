using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AuditManagement.API.Services.Interfaces;

[ApiController]
[Route("api/departments")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _service;

    public DepartmentController(IDepartmentService service)
    {
        _service = service;
    }

    // Admin creates department
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
    {
        await _service.CreateDepartmentAsync(dto);
        return Ok("Department created successfully");
    }

    // All roles can view departments
    [HttpGet]
    [Authorize(Roles = "Admin,Auditor,Employee")]
    public async Task<IActionResult> GetAllDepartments()
    {
        var result = await _service.GetAllDepartmentsAsync();
        return Ok(result);
    }
}
