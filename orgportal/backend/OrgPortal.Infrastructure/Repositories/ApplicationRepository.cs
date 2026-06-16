using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Infrastructure.Data;
using AppEntity = OrgPortal.Domain.Entities.Application;

namespace OrgPortal.Infrastructure.Repositories;

public class ApplicationRepository(AppDbContext db) : BaseRepository<AppEntity>(db), IApplicationRepository
{
    public async Task<IEnumerable<AppEntity>> GetActiveApplicationsAsync() =>
        await _db.Applications.Where(a => a.IsActive).OrderBy(a => a.Order).ToListAsync();

    public async Task<AppEntity?> GetByCodeAsync(string code) =>
        await _db.Applications.FirstOrDefaultAsync(a => a.Code == code);

    public async Task<AppEntity?> GetWithPermissionsAsync(int id) =>
        await _db.Applications.Include(a => a.Permissions).FirstOrDefaultAsync(a => a.Id == id);
}
