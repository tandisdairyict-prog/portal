using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface IRoleRepository : IRepository<Role>
{
    Task<Role?> GetWithPermissionsAsync(int id);
    Task<IEnumerable<Role>> GetActiveRolesAsync();
    Task AssignPermissionAsync(int roleId, int permissionId);
    Task RemovePermissionAsync(int roleId, int permissionId);
    Task<Role?> CloneRoleAsync(int roleId, string newName);
}
