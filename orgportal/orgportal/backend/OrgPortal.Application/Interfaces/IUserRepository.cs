using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface IUserRepository : IRepository<AppUser>
{
    Task<AppUser?> GetByUsernameAsync(string username);
    Task<AppUser?> GetByEmailAsync(string email);
    Task<AppUser?> GetWithPositionsAsync(int id);
    Task<IEnumerable<string>> GetUserPermissionsAsync(int userId);
    Task<AppUser?> GetDirectManagerAsync(int userId);
    Task<IEnumerable<AppUser>> GetByPositionAsync(int positionId);
}
