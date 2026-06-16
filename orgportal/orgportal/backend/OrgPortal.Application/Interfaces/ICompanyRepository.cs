using OrgPortal.Domain.Entities;

namespace OrgPortal.Application.Interfaces;

public interface ICompanyRepository : IRepository<Company>
{
    Task<IEnumerable<Company>> GetActiveCompaniesAsync();
    Task<Company?> GetWithDepartmentsAsync(int id);
}
