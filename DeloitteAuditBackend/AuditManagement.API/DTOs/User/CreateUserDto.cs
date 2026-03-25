using System;

public class CreateUserDto
{
    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public UserRole Role { get; set; }

    public int DepartmentId { get; set; }

    public string Expertise { get; set; } = null!;
}