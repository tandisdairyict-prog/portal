namespace OrgPortal.Application.DTOs;

public record CompanyDto(int Id, string Name, string? ShortName, string? LogoUrl, bool IsActive, DateTime CreatedAt);

public record CreateCompanyDto(string Name, string? ShortName, string? LogoUrl);

public record UpdateCompanyDto(string Name, string? ShortName, string? LogoUrl, bool IsActive);
