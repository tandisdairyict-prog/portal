using OrgPortal.Domain.Entities;
using AppEntity = OrgPortal.Domain.Entities.Application;

namespace OrgPortal.Application.Interfaces;

public interface IApplicationRepository : IRepository<AppEntity>
{
    Task<IEnumerable<AppEntity>> GetActiveApplicationsAsync();
    Task<AppEntity?> GetByCodeAsync(string code);
    Task<AppEntity?> GetWithPermissionsAsync(int id);
}
