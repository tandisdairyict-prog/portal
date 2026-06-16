namespace OrgPortal.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICompanyRepository Companies { get; }
    IDepartmentRepository Departments { get; }
    IPositionRepository Positions { get; }
    IUserRepository Users { get; }
    IRoleRepository Roles { get; }
    IPermissionRepository Permissions { get; }
    IApplicationRepository Applications { get; }
    Task<int> SaveChangesAsync();
}
