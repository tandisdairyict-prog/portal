using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : BaseRepository<AppUser>(db), IUserRepository
{
    public async Task<AppUser?> GetByUsernameAsync(string username) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

    public async Task<AppUser?> GetByEmailAsync(string email) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<AppUser?> GetWithPositionsAsync(int id) =>
        await _db.Users
            .Include(u => u.UserPositions.Where(up => up.IsActive))
                .ThenInclude(up => up.Position)
                    .ThenInclude(p => p.Department)
                        .ThenInclude(d => d.Company)
            .Include(u => u.PermissionOverrides)
                .ThenInclude(o => o.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(int userId)
    {
        var rolePermissions = await _db.UserPositions
            .Where(up => up.UserId == userId && up.IsActive)
            .SelectMany(up => up.Position.PositionRoles)
            .SelectMany(pr => pr.Role.RolePermissions)
            .Select(rp => rp.Permission.Name)
            .ToListAsync();

        var overrides = await _db.UserPermissionOverrides
            .Include(o => o.Permission)
            .Where(o => o.UserId == userId)
            .ToListAsync();

        var granted = overrides.Where(o =>  o.IsGranted).Select(o => o.Permission.Name).ToList();
        var denied  = overrides.Where(o => !o.IsGranted).Select(o => o.Permission.Name).ToHashSet();

        return rolePermissions.Union(granted).Where(p => !denied.Contains(p)).Distinct().ToList();
    }

    public async Task<AppUser?> GetDirectManagerAsync(int userId)
    {
        var primaryPos = await _db.UserPositions
            .Include(up => up.Position)
                .ThenInclude(p => p.ParentPosition)
                    .ThenInclude(pp => pp!.UserPositions.Where(u => u.IsActive && u.IsPrimary))
                        .ThenInclude(up2 => up2.User)
            .Where(up => up.UserId == userId && up.IsActive && up.IsPrimary)
            .FirstOrDefaultAsync();

        return primaryPos?.Position?.ParentPosition?.UserPositions
            .FirstOrDefault(up => up.IsActive && up.IsPrimary)?.User;
    }

    public async Task<IEnumerable<AppUser>> GetByPositionAsync(int positionId) =>
        await _db.UserPositions
            .Where(up => up.PositionId == positionId && up.IsActive)
            .Select(up => up.User)
            .ToListAsync();
}
