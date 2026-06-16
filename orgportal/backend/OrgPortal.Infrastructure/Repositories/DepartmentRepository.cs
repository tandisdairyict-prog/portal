using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class DepartmentRepository(AppDbContext db) : BaseRepository<Department>(db), IDepartmentRepository
{
    public async Task<IEnumerable<Department>> GetByCompanyAsync(int companyId) =>
        await _db.Departments.Where(d => d.CompanyId == companyId).ToListAsync();

    public async Task<IEnumerable<Department>> GetTreeByCompanyAsync(int companyId) =>
        await _db.Departments.Include(d => d.Positions).Where(d => d.CompanyId == companyId && d.ParentDepartmentId == null).ToListAsync();

    public async Task<Department?> GetWithPositionsAsync(int id) =>
        await _db.Departments.Include(d => d.Positions).FirstOrDefaultAsync(d => d.Id == id);
}
