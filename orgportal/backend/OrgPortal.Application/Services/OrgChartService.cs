using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;

namespace OrgPortal.Application.Services;

public class OrgChartService(IUnitOfWork uow) : IOrgChartService
{
    public async Task<List<PositionTreeDto>> GetOrgChartAsync(int? companyId = null)
    {
        var rootPositions = await uow.Positions.GetTreeAsync(null);
        return await BuildTreeAsync(rootPositions);
    }

    private async Task<List<PositionTreeDto>> BuildTreeAsync(IEnumerable<Domain.Entities.Position> positions)
    {
        var result = new List<PositionTreeDto>();
        foreach (var pos in positions)
        {
            var users = await uow.Users.GetByPositionAsync(pos.Id);
            var children = await uow.Positions.GetTreeAsync(pos.Id);
            result.Add(new PositionTreeDto(
                pos.Id, pos.Title, pos.Level, pos.IsActive,
                users.Select(u => new UserSummaryDto(u.Id, u.FullName, u.AvatarUrl, u.PersonnelNumber)).ToList(),
                await BuildTreeAsync(children)
            ));
        }
        return result;
    }

    public async Task<ManagerDto?> GetDirectManagerAsync(int userId)
    {
        var manager = await uow.Users.GetDirectManagerAsync(userId);
        if (manager == null) return null;

        var managerPos = manager.UserPositions.FirstOrDefault(up => up.IsActive && up.IsPrimary);
        return new ManagerDto(manager.Id, manager.FullName, managerPos?.Position.Title ?? "");
    }

    public async Task<List<UserSummaryDto>> GetSubordinatesAsync(int userId)
    {
        var user = await uow.Users.GetWithPositionsAsync(userId);
        var primaryPos = user?.UserPositions.FirstOrDefault(up => up.IsActive && up.IsPrimary);
        if (primaryPos == null) return [];

        var subPositions = await uow.Positions.GetSubordinatePositionsAsync(primaryPos.PositionId);
        var result = new List<UserSummaryDto>();
        foreach (var pos in subPositions)
        {
            var users = await uow.Users.GetByPositionAsync(pos.Id);
            result.AddRange(users.Select(u => new UserSummaryDto(u.Id, u.FullName, u.AvatarUrl, u.PersonnelNumber)));
        }
        return result;
    }

    public async Task MovePositionAsync(int positionId, int? newParentPositionId)
    {
        var position = await uow.Positions.GetByIdAsync(positionId)
            ?? throw new KeyNotFoundException("Position not found");
        position.ParentPositionId = newParentPositionId;
        await uow.Positions.UpdateAsync(position);
        await uow.SaveChangesAsync();
    }
}
