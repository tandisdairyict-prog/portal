using OrgPortal.Application.DTOs;

namespace OrgPortal.Application.Interfaces;

public interface IPermissionService
{
    Task<List<string>> GetUserPermissionsAsync(int userId);
    Task<List<PermissionTreeDto>> GetPermissionTreeAsync();
    Task<List<PermissionTreeDto>> GetUserPermissionTreeAsync(int userId);
    Task SetPermissionOverrideAsync(SetPermissionOverrideDto dto);
    Task RemovePermissionOverrideAsync(int userId, int permissionId);
    Task<bool> UserHasPermissionAsync(int userId, string permissionName);
}
