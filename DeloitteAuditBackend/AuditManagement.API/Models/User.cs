using System;
using System.Collections.Generic;

namespace AuditManagement.API.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Role { get; set; } = null!;

    public int? DepartmentId { get; set; }

    public string? Expertise {get; set;}

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<Audit> AuditAuditors { get; set; } = new List<Audit>();

    public virtual ICollection<Audit> AuditCreatedByUsers { get; set; } = new List<Audit>();

    public virtual ICollection<CorrectiveAction> CorrectiveActions { get; set; } = new List<CorrectiveAction>();

    public virtual Department? Department { get; set; }
}
