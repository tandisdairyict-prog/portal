using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class PositionRepository(AppDbContext db) : BaseRepository<Position>(db), IPositionRepository
{
    public async Task<IEnumerable<Position>> GetByDepartmentAsync(int departmentId) =>
        await _db.Positions.Where(p => p.DepartmentId == departmentId && p.IsActive).ToListAsync();

    public async Task<IEnumerable<Position>> GetTreeAsync(int? parentId = null) =>
        await _db.Positions.Where(p => p.ParentPositionId == parentId && p.IsActive).ToListAsync();

    public async Task<Position?> GetWithRolesAsync(int id) =>
        await _db.Positions
            .Include(p => p.PositionRoles).ThenInclude(pr => pr.Role).ThenInclude(r => r.RolePermissions).ThenInclude(rp => rp.Permission)
            .Include(p => p.UserPositions.Where(up => up.IsActive)).ThenInclude(up => up.User)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<AppUser?> GetManagerAsync(int positionId)
    {
        var pos = await _db.Positions
            .Include(p => p.ParentPosition)
                .ThenInclude(pp => pp!.UserPositions.Where(up => up.IsActive && up.IsPrimary))
                    .ThenInclude(up => up.User)
            .FirstOrDefaultAsync(p => p.Id == positionId);
        return pos?.ParentPosition?.UserPositions.FirstOrDefault()?.User;
    }

    public async Task<IEnumerable<Position>> GetSubordinatePositionsAsync(int positionId)
    {
        var result = new List<Position>();
        var children = await _db.Positions.Where(p => p.ParentPositionId == positionId).ToListAsync();
        foreach (var child in children)
        {
            result.Add(child);
            result.AddRange(await GetSubordinatePositionsAsync(child.Id));
        }
        return result;
    }
}
