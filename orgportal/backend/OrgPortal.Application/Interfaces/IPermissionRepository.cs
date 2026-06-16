using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface IPermissionRepository : IRepository<Permission>
{
    Task<IEnumerable<Permission>> GetByApplicationAsync(int applicationId);
    Task<IEnumerable<Permission>> GetByApplicationCodeAsync(string appCode);
    Task<IEnumerable<Permission>> GetTreeAsync();
}
