namespace OrgPortal.Application.DTOs;

public record RoleDto(int Id, string Name, string? Description, bool IsActive, DateTime CreatedAt, List<PermissionDto> Permissions);

public record RoleSummaryDto(int Id, string Name, bool IsActive);

public record CreateRoleDto(string Name, string? Description);

public record UpdateRoleDto(string Name, string? Description, bool IsActive);

public record AssignRolePermissionsDto(int RoleId, List<int> PermissionIds);

public record CloneRoleDto(string NewName);
