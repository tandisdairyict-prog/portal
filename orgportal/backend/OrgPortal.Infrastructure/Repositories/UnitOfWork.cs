using OrgPortal.Application.Interfaces;
using OrgPortal.Infrastructure.Data;

namespace OrgPortal.Infrastructure.Repositories;

public class UnitOfWork(
    AppDbContext db,
    ICompanyRepository companies,
    IDepartmentRepository departments,
    IPositionRepository positions,
    IUserRepository users,
    IRoleRepository roles,
    IPermissionRepository permissions,
    IApplicationRepository applications) : IUnitOfWork
{
    public ICompanyRepository Companies { get; } = companies;
    public IDepartmentRepository Departments { get; } = departments;
    public IPositionRepository Positions { get; } = positions;
    public IUserRepository Users { get; } = users;
    public IRoleRepository Roles { get; } = roles;
    public IPermissionRepository Permissions { get; } = permissions;
    public IApplicationRepository Applications { get; } = applications;

    public async Task<int> SaveChangesAsync() => await db.SaveChangesAsync();
    public void Dispose() => db.Dispose();
}
