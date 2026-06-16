using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface IPositionRepository : IRepository<Position>
{
    Task<IEnumerable<Position>> GetByDepartmentAsync(int departmentId);
    Task<IEnumerable<Position>> GetTreeAsync(int? parentId = null);
    Task<Position?> GetWithRolesAsync(int id);
    Task<AppUser?> GetManagerAsync(int positionId);
    Task<IEnumerable<Position>> GetSubordinatePositionsAsync(int positionId);
}
