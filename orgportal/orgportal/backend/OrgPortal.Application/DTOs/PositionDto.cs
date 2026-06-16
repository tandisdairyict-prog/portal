namespace OrgPortal.Application.DTOs;

public record PositionDto(int Id, int DepartmentId, string DepartmentName, int? ParentPositionId, string? ParentPositionTitle, string Title, string? Description, int Level, bool IsActive, List<RoleDto> Roles, List<UserSummaryDto> AssignedUsers);

public record PositionTreeDto(int Id, string Title, int Level, bool IsActive, List<UserSummaryDto> AssignedUsers, List<PositionTreeDto> Children);

public record CreatePositionDto(int DepartmentId, int? ParentPositionId, string Title, string? Description);

public record UpdatePositionDto(int? ParentPositionId, string Title, string? Description, bool IsActive);

public record MovePositionDto(int NewParentPositionId);
