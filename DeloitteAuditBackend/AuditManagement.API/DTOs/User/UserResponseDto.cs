using System;

public class UserResponseDto
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Role { get; set; } = null!;

    public int DepartmentId { get; set; }

    public string Expertise { get; set; } = null!;

    public string? Token { get; set; }
}