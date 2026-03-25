using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AuditManagement.API.Services.Interfaces;

[ApiController]
[Route("api/audits")]
[Authorize]
public class AuditController : ControllerBase
{
    private readonly IAuditService _auditService;

    public AuditController(IAuditService auditService)
    {
        _auditService = auditService;
    }

    // Only Admin creates audit
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAudit([FromBody] CreateAuditDto dto)
    {
        var userId = int.Parse(User.FindFirst("UserId")!.Value);

        await _auditService.CreateAuditAsync(dto, userId);
        return Ok("Audit created successfully");
    }

    // Admin → own audits
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAuditsForAdmin()
    {
        var userId = int.Parse(User.FindFirst("UserId")!.Value);

        var result = await _auditService.GetAuditsForAdmin(userId);
        return Ok(result);
    }

    // Auditor → assigned audits
    [HttpGet("auditor")]
    [Authorize(Roles = "Auditor")]
    public async Task<IActionResult> GetAuditsForAuditor()
    {
        var userId = int.Parse(User.FindFirst("UserId")!.Value);
        var result = await _auditService.GetAuditsForAuditor(userId);
        return Ok(result);
    }

    // Auditor submits audit for approval
    [HttpPut("{id}/submit")]
    [Authorize(Roles = "Auditor")]
    public async Task<IActionResult> SubmitAudit(int id)
    {
        var userId = int.Parse(User.FindFirst("UserId")!.Value);
        try
        {
            await _auditService.SubmitAuditAsync(id, userId);
            return Ok("Audit submitted for approval");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveAudit(int id)
    {
        try
        {
            await _auditService.ApproveAuditAsync(id);
            return Ok("Audit approved and marked as completed");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}