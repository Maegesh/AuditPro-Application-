using System;

public class AuthResponseDto
{
    public string Token { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Name { get; set; } = null!;
}