namespace OrgPortal.Application.DTOs;

public record ApplicationDto(int Id, string Name, string Code, string? Description, string? IconClass, string? Url, bool IsActive, int Order);

public record CreateApplicationDto(string Name, string Code, string? Description, string? IconClass, string? Url, int Order);

public record UpdateApplicationDto(string Name, string? Description, string? IconClass, string? Url, bool IsActive, int Order);
