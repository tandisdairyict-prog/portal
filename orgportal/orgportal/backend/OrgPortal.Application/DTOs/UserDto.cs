namespace OrgPortal.Application.DTOs;

public record UserDto(int Id, string Username, string Email, string FirstName, string LastName, string FullName, string? PersonnelNumber, string? NationalId, string? PhoneNumber, string? AvatarUrl, bool IsActive, bool IsAdUser, DateTime CreatedAt, DateTime? LastLoginAt, List<UserPositionDto> Positions);

public record UserSummaryDto(int Id, string FullName, string? AvatarUrl, string? PersonnelNumber);

public record CreateUserDto(string Username, string Email, string Password, string FirstName, string LastName, string? PersonnelNumber, string? NationalId, string? PhoneNumber);

public record UpdateUserDto(string Email, string FirstName, string LastName, string? PersonnelNumber, string? NationalId, string? PhoneNumber, bool IsActive);

public record ChangePasswordDto(string CurrentPassword, string NewPassword);

public record UserPositionDto(int PositionId, string PositionTitle, string DepartmentName, string CompanyName, bool IsPrimary, bool IsActive);

public record AssignUserPositionDto(int UserId, int PositionId, bool IsPrimary);

public record UserPermissionsDto(int UserId, string FullName, List<string> Permissions);

public record ManagerDto(int UserId, string FullName, string PositionTitle);
