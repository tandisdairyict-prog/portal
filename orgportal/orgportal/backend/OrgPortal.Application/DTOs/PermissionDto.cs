namespace OrgPortal.Application.DTOs;

public record PermissionDto(int Id, int ApplicationId, string ApplicationCode, string ApplicationName, string Name, string Module, string Action, string? Description);

public record PermissionTreeDto(string AppCode, string AppName, List<PermissionModuleDto> Modules);

public record PermissionModuleDto(string Module, List<PermissionActionDto> Actions);

public record PermissionActionDto(int Id, string Action, string FullName, bool IsGranted);

public record UserPermissionOverrideDto(int Id, int UserId, int PermissionId, string PermissionName, bool IsGranted, string? Reason, DateTime CreatedAt);

public record SetPermissionOverrideDto(int UserId, int PermissionId, bool IsGranted, string? Reason);
