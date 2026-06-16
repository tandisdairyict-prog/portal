using OrgPortal.Application.DTOs;

namespace OrgPortal.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);
    string GenerateJwtToken(Domain.Entities.AppUser user, IEnumerable<string> permissions);
}
