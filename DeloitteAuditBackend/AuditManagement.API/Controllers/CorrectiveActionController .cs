using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AuditManagement.API.Services.Interfaces;

[ApiController]
[Route("api/actions")]
[Authorize]
public class CorrectiveActionController : ControllerBase
{
    private readonly ICorrectiveActionService _service;

    public CorrectiveActionController(ICorrectiveActionService service)
    {
        _service = service;
    }

    //  Admin/Auditor assigns action
    [HttpPost]
    [Authorize(Roles = "Admin,Auditor")]
    public async Task<IActionResult> CreateAction([FromBody] CreateCorrectiveActionDto dto)
    {
        await _service.CreateActionAsync(dto);
        return Ok("Corrective action created");
    }

    // Auditor updates corrective action
    [HttpPut("{id}")]
    [Authorize(Roles = "Auditor")]
    public async Task<IActionResult> UpdateAction(int id, [FromBody] UpdateCorrectiveActionDto dto)
    {
        await _service.UpdateActionAsync(id, dto);
        return Ok("Corrective action updated successfully");
    }

    //  Employee + Admin can view actions
    [HttpGet("{observationId}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetActions(int observationId)
    {
        var result = await _service.GetActionsByObservation(observationId);
        return Ok(result);
    }

    // Employee views only their assigned actions
    [HttpGet("my")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMyActions()
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        var result = await _service.GetMyActionsAsync(userId);
        return Ok(result);
    }

    // Employee updates status of their assigned action
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateActionStatusDto dto)
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        await _service.UpdateActionStatusAsync(id, dto, userId);
        return Ok("Status updated successfully");
    }

    // Employee, Admin, Auditor can download PDF
    [HttpGet("{id}/pdf")]
    [Authorize(Roles = "Admin,Auditor,Employee")]
    public async Task<IActionResult> GetActionPdf(int id)
    {
        var pdfBytes = await _service.GetActionPdfAsync(id);
        return File(pdfBytes, "application/pdf", $"CorrectiveAction_{id}.pdf");
    }
}