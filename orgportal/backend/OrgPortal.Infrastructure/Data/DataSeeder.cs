using Microsoft.EntityFrameworkCore;
using OrgPortal.Domain.Entities;
using AppEntity = OrgPortal.Domain.Entities.Application;

namespace OrgPortal.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Applications.AnyAsync())
        {
            var apps = new List<AppEntity>
            {
                new() { Name = "پرتال", Code = "Portal", IconClass = "bi-grid-1x2", Order = 1 },
                new() { Name = "فرآیند (BPM)", Code = "BPM", IconClass = "bi-diagram-2", Order = 2 },
                new() { Name = "هوش تجاری (BI)", Code = "BI", IconClass = "bi-bar-chart", Order = 3 },
                new() { Name = "حضور و غیاب", Code = "Attendance", IconClass = "bi-calendar-check", Order = 4 },
                new() { Name = "منابع انسانی", Code = "HR", IconClass = "bi-people", Order = 5 },
                new() { Name = "حسابداری", Code = "Accounting", IconClass = "bi-wallet2", Order = 6 },
            };
            db.Applications.AddRange(apps);
            await db.SaveChangesAsync();
        }

        if (!await db.Permissions.AnyAsync())
        {
            var apps = await db.Applications.ToListAsync();
            var permissions = new List<Permission>();

            var permDefs = new Dictionary<string, List<(string module, string action)>>
            {
                ["Portal"] = [("Users","View"),("Users","Create"),("Users","Edit"),("Users","Delete"),
                              ("Roles","View"),("Roles","Create"),("Roles","Edit"),("Roles","Delete"),
                              ("Permissions","View"),("Permissions","Edit"),
                              ("OrgChart","View"),("OrgChart","Edit")],
                ["BPM"]    = [("Process","View"),("Process","Create"),("Process","Edit"),("Process","Delete"),
                              ("Task","View"),("Task","Complete")],
                ["BI"]     = [("Dashboard","View"),("Report","View"),("Report","Export")],
                ["Attendance"] = [("Record","View"),("Record","Edit"),("Report","View"),("Report","Export")],
                ["HR"]     = [("Employee","View"),("Employee","Create"),("Employee","Edit"),
                              ("Leave","View"),("Leave","Approve")],
                ["Accounting"] = [("Invoice","View"),("Invoice","Create"),("Invoice","Edit"),
                                  ("Report","View"),("Report","Export")],
            };

            foreach (var (code, defs) in permDefs)
            {
                var app = apps.First(a => a.Code == code);
                permissions.AddRange(defs.Select(d => new Permission
                {
                    ApplicationId = app.Id,
                    Name = $"{code}.{d.module}.{d.action}",
                    Module = d.module,
                    Action = d.action,
                    Description = $"{d.action} {d.module} in {code}"
                }));
            }
            db.Permissions.AddRange(permissions);
            await db.SaveChangesAsync();
        }

        if (!await db.Companies.AnyAsync())
        {
            var company = new Company { Name = "شرکت نمونه", ShortName = "نمونه" };
            db.Companies.Add(company);
            await db.SaveChangesAsync();

            var itDept = new Department { CompanyId = company.Id, Name = "واحد IT", Code = "IT" };
            var hrDept = new Department { CompanyId = company.Id, Name = "واحد منابع انسانی", Code = "HR" };
            db.Departments.AddRange(itDept, hrDept);
            await db.SaveChangesAsync();

            var itManager = new Position { DepartmentId = itDept.Id, Title = "مدیر IT", Level = 1 };
            db.Positions.Add(itManager);
            await db.SaveChangesAsync();

            var devSup   = new Position { DepartmentId = itDept.Id, Title = "سرپرست توسعه", Level = 2, ParentPositionId = itManager.Id };
            var infraSup = new Position { DepartmentId = itDept.Id, Title = "سرپرست زیرساخت", Level = 2, ParentPositionId = itManager.Id };
            db.Positions.AddRange(devSup, infraSup);
            await db.SaveChangesAsync();

            var seniorDev = new Position { DepartmentId = itDept.Id, Title = "توسعه‌دهنده ارشد", Level = 3, ParentPositionId = devSup.Id };
            var developer = new Position { DepartmentId = itDept.Id, Title = "توسعه‌دهنده", Level = 3, ParentPositionId = devSup.Id };
            var netExp    = new Position { DepartmentId = itDept.Id, Title = "کارشناس شبکه", Level = 3, ParentPositionId = infraSup.Id };
            db.Positions.AddRange(seniorDev, developer, netExp);
            await db.SaveChangesAsync();

            var itManagerRole = new Role { Name = "IT_Manager_Role", Description = "نقش مدیر IT" };
            var devRole       = new Role { Name = "Developer_Role",   Description = "نقش توسعه‌دهنده" };
            var hrRole        = new Role { Name = "HR_Role",          Description = "نقش منابع انسانی" };
            db.Roles.AddRange(itManagerRole, devRole, hrRole);
            await db.SaveChangesAsync();

            db.PositionRoles.AddRange(
                new PositionRole { PositionId = itManager.Id, RoleId = itManagerRole.Id },
                new PositionRole { PositionId = developer.Id, RoleId = devRole.Id },
                new PositionRole { PositionId = seniorDev.Id, RoleId = devRole.Id }
            );

            var allPerms = await db.Permissions.ToListAsync();
            var portalPerms = allPerms.Where(p => p.Name.StartsWith("Portal.")).ToList();
            var biPerms     = allPerms.Where(p => p.Name.StartsWith("BI.")).ToList();

            foreach (var perm in portalPerms)
                db.RolePermissions.Add(new RolePermission { RoleId = itManagerRole.Id, PermissionId = perm.Id });

            foreach (var perm in biPerms.Take(2))
                db.RolePermissions.Add(new RolePermission { RoleId = devRole.Id, PermissionId = perm.Id });

            await db.SaveChangesAsync();

            var adminUser = new AppUser
            {
                Username = "admin", Email = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FirstName = "علی", LastName = "احمدی",
                PersonnelNumber = "100001", NationalId = "0000000001"
            };
            var rezaUser = new AppUser
            {
                Username = "reza", Email = "reza@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Reza@123"),
                FirstName = "رضا", LastName = "محمدی",
                PersonnelNumber = "100002", NationalId = "0000000002"
            };
            var mohammadUser = new AppUser
            {
                Username = "mohammad", Email = "mohammad@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Mohammad@123"),
                FirstName = "محمد", LastName = "رضایی",
                PersonnelNumber = "100003", NationalId = "0000000003"
            };
            db.Users.AddRange(adminUser, rezaUser, mohammadUser);
            await db.SaveChangesAsync();

            db.UserPositions.AddRange(
                new UserPosition { UserId = adminUser.Id,    PositionId = itManager.Id, IsPrimary = true },
                new UserPosition { UserId = rezaUser.Id,     PositionId = devSup.Id,    IsPrimary = true },
                new UserPosition { UserId = mohammadUser.Id, PositionId = developer.Id, IsPrimary = true }
            );
            await db.SaveChangesAsync();
        }
    }
}
