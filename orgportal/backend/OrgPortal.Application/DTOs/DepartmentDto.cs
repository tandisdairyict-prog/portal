namespace OrgPortal.Application.DTOs;

public record DepartmentDto(int Id, int CompanyId, string CompanyName, int? ParentDepartmentId, string Name, string Code, bool IsActive);

public record DepartmentTreeDto(int Id, string Name, string Code, bool IsActive, List<DepartmentTreeDto> Children, List<PositionDto> Positions);

public record CreateDepartmentDto(int CompanyId, int? ParentDepartmentId, string Name, string Code);

public record UpdateDepartmentDto(int? ParentDepartmentId, string Name, string Code, bool IsActive);
