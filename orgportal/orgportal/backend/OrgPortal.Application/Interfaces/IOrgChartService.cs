using OrgPortal.Application.DTOs;

namespace OrgPortal.Application.Interfaces;

public interface IOrgChartService
{
    Task<List<PositionTreeDto>> GetOrgChartAsync(int? companyId = null);
    Task<ManagerDto?> GetDirectManagerAsync(int userId);
    Task<List<UserSummaryDto>> GetSubordinatesAsync(int userId);
    Task MovePositionAsync(int positionId, int? newParentPositionId);
}
