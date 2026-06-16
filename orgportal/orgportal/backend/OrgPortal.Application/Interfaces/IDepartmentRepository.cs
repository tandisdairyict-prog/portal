using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<IEnumerable<Department>> GetByCompanyAsync(int companyId);
    Task<IEnumerable<Department>> GetTreeByCompanyAsync(int companyId);
    Task<Department?> GetWithPositionsAsync(int id);
}
