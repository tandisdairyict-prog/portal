namespace OrgPortal.Application.DTOs;

public record LoginDto(string Username, string Password);

public record LoginResponseDto(string Token, string RefreshToken, DateTime ExpiresAt, UserDto User);

public record RefreshTokenDto(string RefreshToken);
