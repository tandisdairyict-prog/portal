using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.Infrastructure.Services;

public class AuthService(IUnitOfWork uow, IConfiguration config) : IAuthService
{
    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await uow.Users.GetByUsernameAsync(dto.Username)
            ?? throw new UnauthorizedAccessException("نام کاربری یا رمز عبور اشتباه است");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("حساب کاربری غیرفعال است");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("نام کاربری یا رمز عبور اشتباه است");

        user.LastLoginAt = DateTime.UtcNow;
        await uow.SaveChangesAsync();

        var permissions = await uow.Users.GetUserPermissionsAsync(user.Id);
        var token = GenerateJwtToken(user, permissions);
        var refreshToken = Guid.NewGuid().ToString("N");

        return new LoginResponseDto(token, refreshToken, DateTime.UtcNow.AddHours(8), MapUserDto(user, []));
    }

    public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException("Refresh token storage not implemented");
    }

    public string GenerateJwtToken(AppUser user, IEnumerable<string> permissions)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new("FullName", user.FullName),
        };
        claims.AddRange(permissions.Select(p => new Claim("permission", p)));

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapUserDto(AppUser user, List<UserPositionDto> positions) =>
        new(user.Id, user.Username, user.Email, user.FirstName, user.LastName, user.FullName,
            user.PersonnelNumber, user.NationalId, user.PhoneNumber, user.AvatarUrl,
            user.IsActive, user.IsAdUser, user.CreatedAt, user.LastLoginAt, positions);
}
