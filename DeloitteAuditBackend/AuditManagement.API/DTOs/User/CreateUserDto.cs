using System;

public class CreateUserDto
{
    public string Name { get; set; }

    public string Email { get; set; }

    public UserRole Role { get; set; } 

    public int DepartmentId { get; set; }

    public string Expertise { get; set; } 
}