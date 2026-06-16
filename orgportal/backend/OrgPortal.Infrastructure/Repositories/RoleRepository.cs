using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class RoleRepository(AppDbContext db) : BaseRepository<Role>(db), IRoleRepository
{
    public async Task<Role?> GetWithPermissionsAsync(int id) =>
        await _db.Roles
            .Include(r => r.RolePermissions).ThenInclude(rp => rp.Permission).ThenInclude(p => p.Application)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<IEnumerable<Role>> GetActiveRolesAsync() =>
        await _db.Roles.Where(r => r.IsActive).ToListAsync();

    public async Task AssignPermissionAsync(int roleId, int permissionId)
    {
        if (!await _db.RolePermissions.AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId))
            _db.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = permissionId });
    }

    public async Task RemovePermissionAsync(int roleId, int permissionId)
    {
        var rp = await _db.RolePermissions.FirstOrDefaultAsync(r => r.RoleId == roleId && r.PermissionId == permissionId);
        if (rp != null) _db.RolePermissions.Remove(rp);
    }

    public async Task<Role?> CloneRoleAsync(int roleId, string newName)
    {
        var source = await GetWithPermissionsAsync(roleId);
        if (source == null) return null;

        var clone = new Role { Name = newName, Description = $"کپی از {source.Name}" };
        _db.Roles.Add(clone);
        await _db.SaveChangesAsync();

        foreach (var rp in source.RolePermissions)
            _db.RolePermissions.Add(new RolePermission { RoleId = clone.Id, PermissionId = rp.PermissionId });

        return clone;
    }
}
