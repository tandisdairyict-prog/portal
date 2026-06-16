using Microsoft.EntityFrameworkCore;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class PermissionRepository(AppDbContext db) : BaseRepository<Permission>(db), IPermissionRepository
{
    public async Task<IEnumerable<Permission>> GetByApplicationAsync(int applicationId) =>
        await _db.Permissions.Where(p => p.ApplicationId == applicationId).ToListAsync();

    public async Task<IEnumerable<Permission>> GetByApplicationCodeAsync(string appCode) =>
        await _db.Permissions.Include(p => p.Application).Where(p => p.Application.Code == appCode).ToListAsync();

    public async Task<IEnumerable<Permission>> GetTreeAsync() =>
        await _db.Permissions.Include(p => p.Application).OrderBy(p => p.ApplicationId).ThenBy(p => p.Module).ToListAsync();
}
