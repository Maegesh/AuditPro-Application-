using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AuditManagement.API.Services.Interfaces;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // Admin can create
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        await _userService.CreateUserAsync(dto);
        return Ok("User created and email sent");
    }

    // update profile
    [HttpPut("me")]
    [Authorize(Roles = "Auditor,Employee")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        await _userService.UpdateProfileAsync(userId, dto);
        return Ok("Profile updated successfully");
    }

    // Admin fetches auditors by department for audit assignment
    [HttpGet("auditors")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAuditorsByDepartment([FromQuery] int departmentId)
    {
        var result = await _userService.GetAuditorsByDepartmentAsync(departmentId);
        return Ok(result);
    }

    // Admin fetches all users
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _userService.GetAllUsersAsync();
        return Ok(result);
    }
}
