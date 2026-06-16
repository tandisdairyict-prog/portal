using Microsoft.EntityFrameworkCore;
using OrgPortal.Domain.Entities;
using AppEntity = OrgPortal.Domain.Entities.Application;

namespace OrgPortal.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<AppEntity> Applications => Set<AppEntity>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<PositionRole> PositionRoles => Set<PositionRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserPosition> UserPositions => Set<UserPosition>();
    public DbSet<UserPermissionOverride> UserPermissionOverrides => Set<UserPermissionOverride>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        mb.Entity<Company>(e => {
            e.ToTable("Companies");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.ShortName).HasMaxLength(50);
        });

        mb.Entity<Department>(e => {
            e.ToTable("Departments");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.Property(x => x.Code).HasMaxLength(20).IsRequired();
            e.HasOne(x => x.Company).WithMany(c => c.Departments).HasForeignKey(x => x.CompanyId);
            e.HasOne(x => x.ParentDepartment).WithMany(d => d.SubDepartments).HasForeignKey(x => x.ParentDepartmentId).OnDelete(DeleteBehavior.Restrict);
        });

        mb.Entity<Position>(e => {
            e.ToTable("Positions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.Property(x => x.Description).HasMaxLength(500);
            e.HasOne(x => x.Department).WithMany(d => d.Positions).HasForeignKey(x => x.DepartmentId);
            e.HasOne(x => x.ParentPosition).WithMany(p => p.SubPositions).HasForeignKey(x => x.ParentPositionId).OnDelete(DeleteBehavior.Restrict);
        });

        mb.Entity<AppUser>(e => {
            e.ToTable("Users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Username).HasMaxLength(100).IsRequired();
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Email).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
            e.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
            e.Property(x => x.LastName).HasMaxLength(100).IsRequired();
            e.Property(x => x.PersonnelNumber).HasMaxLength(20);
            e.HasIndex(x => x.PersonnelNumber).IsUnique().HasFilter("[PersonnelNumber] IS NOT NULL");
            e.Property(x => x.NationalId).HasMaxLength(10);
            e.Ignore(x => x.FullName);
        });

        mb.Entity<AppEntity>(e => {
            e.ToTable("Applications");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Code).HasMaxLength(50).IsRequired();
            e.HasIndex(x => x.Code).IsUnique();
        });

        mb.Entity<Permission>(e => {
            e.ToTable("Permissions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.Name).IsUnique();
            e.Property(x => x.Module).HasMaxLength(100).IsRequired();
            e.Property(x => x.Action).HasMaxLength(100).IsRequired();
            e.HasOne(x => x.Application).WithMany(a => a.Permissions).HasForeignKey(x => x.ApplicationId);
        });

        mb.Entity<Role>(e => {
            e.ToTable("Roles");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.Name).IsUnique();
        });

        mb.Entity<PositionRole>(e => {
            e.ToTable("PositionRoles");
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.PositionId, x.RoleId }).IsUnique();
            e.HasOne(x => x.Position).WithMany(p => p.PositionRoles).HasForeignKey(x => x.PositionId);
            e.HasOne(x => x.Role).WithMany(r => r.PositionRoles).HasForeignKey(x => x.RoleId);
        });

        mb.Entity<RolePermission>(e => {
            e.ToTable("RolePermissions");
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.RoleId, x.PermissionId }).IsUnique();
            e.HasOne(x => x.Role).WithMany(r => r.RolePermissions).HasForeignKey(x => x.RoleId);
            e.HasOne(x => x.Permission).WithMany(p => p.RolePermissions).HasForeignKey(x => x.PermissionId);
        });

        mb.Entity<UserPosition>(e => {
            e.ToTable("UserPositions");
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany(u => u.UserPositions).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Position).WithMany(p => p.UserPositions).HasForeignKey(x => x.PositionId);
        });

        mb.Entity<UserPermissionOverride>(e => {
            e.ToTable("UserPermissionOverrides");
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.UserId, x.PermissionId }).IsUnique();
            e.HasOne(x => x.User).WithMany(u => u.PermissionOverrides).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Permission).WithMany(p => p.UserOverrides).HasForeignKey(x => x.PermissionId);
        });
    }
}
