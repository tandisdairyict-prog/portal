using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class CompanyRepository(AppDbContext db) : BaseRepository<Company>(db), ICompanyRepository
{
    public async Task<IEnumerable<Company>> GetActiveCompaniesAsync() =>
        await _db.Companies.Where(c => c.IsActive).ToListAsync();

    public async Task<Company?> GetWithDepartmentsAsync(int id) =>
        await _db.Companies.Include(c => c.Departments).FirstOrDefaultAsync(c => c.Id == id);
}
