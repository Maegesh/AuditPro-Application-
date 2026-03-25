using AuditManagement.API.Repositories.Interfaces;
using AuditManagement.API.Services.Interfaces;
using AuditManagement.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AuditManagement.API.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<UserService> _logger;
    private readonly IConfiguration _config;

    public UserService(IUserRepository userRepository, IEmailService emailService, ILogger<UserService> logger, IConfiguration config)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
        _config = config;
    }

    public async Task CreateUserAsync(CreateUserDto dto)
    {
        _logger.LogInformation("Creating user with email: {Email}", dto.Email);

        var password = GeneratePassword();

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Role = dto.Role.ToString(),
            DepartmentId = dto.DepartmentId,
            Expertise = dto.Expertise,
            Password = password
        };

        await _userRepository.AddAsync(user);

        _logger.LogInformation("User saved to DB: {Email}", dto.Email);

        var body = $@"Hello {dto.Name},<br/>Your account has been created.<br/><b>Email:</b> {dto.Email}<br/><b>Password:</b> {password}";

        await _emailService.SendEmailAsync(dto.Email, "Login Credentials", body);

        _logger.LogInformation("Email sent to user: {Email}", dto.Email);
    }

    public async Task<UserResponseDto> LoginAsync(LoginDto dto)
    {
        _logger.LogInformation("Login attempt for: {Email}", dto.Email);

        var user = await _userRepository.GetByEmailAsync(dto.Email);

        if (user == null || user.Password != dto.Password)
        {
            _logger.LogWarning("Invalid login for: {Email}", dto.Email);
            throw new Exception("Invalid credentials");
        }

        var token = GenerateJwtToken(user);

        _logger.LogInformation("Login successful for: {Email}", dto.Email);

        return new UserResponseDto
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            DepartmentId = user.DepartmentId ?? 0,
            Expertise = user.Expertise,
            Token = token
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("UserId", user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GeneratePassword() => Guid.NewGuid().ToString()[..8];

    public async Task<List<UserResponseDto>> GetAuditorsByDepartmentAsync(int departmentId)
    {
        var auditors = await _userRepository.GetAuditorsByDepartmentAsync(departmentId);
        return auditors.Select(u => new UserResponseDto
        {
            UserId = u.UserId,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            DepartmentId = u.DepartmentId ?? 0,
            Expertise = u.Expertise
        }).ToList();
    }

    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(u => new UserResponseDto
        {
            UserId = u.UserId,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            DepartmentId = u.DepartmentId ?? 0,
            Expertise = u.Expertise
        }).ToList();
    }

    public async Task UpdateProfileAsync(int userId, UpdateUserDto dto)
    {
        _logger.LogInformation("Updating profile for UserId: {UserId}", userId);

        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            _logger.LogWarning("User not found for UserId: {UserId}", userId);
            throw new Exception("User not found");
        }

        if (!string.IsNullOrWhiteSpace(dto.Name))
            user.Name = dto.Name;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.Password = dto.Password;

        if (!string.IsNullOrWhiteSpace(dto.Expertise))
            user.Expertise = dto.Expertise;

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("Profile updated successfully for UserId: {UserId}", userId);
    }
}
