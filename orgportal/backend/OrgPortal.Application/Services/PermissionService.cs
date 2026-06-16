using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;

namespace OrgPortal.Application.Services;

public class PermissionService(IUnitOfWork uow) : IPermissionService
{
    public async Task<List<string>> GetUserPermissionsAsync(int userId)
    {
        var user = await uow.Users.GetWithPositionsAsync(userId)
            ?? throw new KeyNotFoundException($"User {userId} not found");

        var permissionNames = await uow.Users.GetUserPermissionsAsync(userId);
        return permissionNames.ToList();
    }

    public async Task<List<PermissionTreeDto>> GetPermissionTreeAsync()
    {
        var apps = await uow.Applications.GetActiveApplicationsAsync();
        var result = new List<PermissionTreeDto>();

        foreach (var app in apps)
        {
            var appWithPerms = await uow.Applications.GetWithPermissionsAsync(app.Id);
            if (appWithPerms?.Permissions == null) continue;

            var modules = appWithPerms.Permissions
                .GroupBy(p => p.Module)
                .Select(g => new PermissionModuleDto(
                    g.Key,
                    g.Select(p => new PermissionActionDto(p.Id, p.Action, p.Name, false)).ToList()
                )).ToList();

            result.Add(new PermissionTreeDto(app.Code, app.Name, modules));
        }
        return result;
    }

    public async Task<List<PermissionTreeDto>> GetUserPermissionTreeAsync(int userId)
    {
        var userPermissions = (await GetUserPermissionsAsync(userId)).ToHashSet();
        var apps = await uow.Applications.GetActiveApplicationsAsync();
        var result = new List<PermissionTreeDto>();

        foreach (var app in apps)
        {
            var appWithPerms = await uow.Applications.GetWithPermissionsAsync(app.Id);
            if (appWithPerms?.Permissions == null) continue;

            var modules = appWithPerms.Permissions
                .GroupBy(p => p.Module)
                .Select(g => new PermissionModuleDto(
                    g.Key,
                    g.Select(p => new PermissionActionDto(
                        p.Id, p.Action, p.Name,
                        userPermissions.Contains(p.Name)
                    )).ToList()
                )).ToList();

            result.Add(new PermissionTreeDto(app.Code, app.Name, modules));
        }
        return result;
    }

    public async Task SetPermissionOverrideAsync(SetPermissionOverrideDto dto)
    {
        var user = await uow.Users.GetByIdAsync(dto.UserId)
            ?? throw new KeyNotFoundException("User not found");
        var permission = await uow.Permissions.GetByIdAsync(dto.PermissionId)
            ?? throw new KeyNotFoundException("Permission not found");

        await uow.SaveChangesAsync();
    }

    public async Task RemovePermissionOverrideAsync(int userId, int permissionId)
    {
        await uow.SaveChangesAsync();
    }

    public async Task<bool> UserHasPermissionAsync(int userId, string permissionName)
    {
        var permissions = await GetUserPermissionsAsync(userId);
        return permissions.Contains(permissionName);
    }
}
