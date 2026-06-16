# Enterprise OrgPortal

## Stack
- Backend: ASP.NET Core 8 Web API (Clean Architecture)
- Frontend: React + TypeScript + Ant Design
- Database: SQL Server
- Auth: JWT

## Quick Start

### 1. Configure Database
Edit `backend/OrgPortal.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=OrgPortalDB;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
}
```

### 2. Install & Run (Windows)
```
install.bat
run.bat
```

### 3. Default Login
- Username: `admin`
- Password: `Admin@123`

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

## Architecture
```
backend/
├── OrgPortal.Domain/         # Entities
├── OrgPortal.Application/    # Interfaces, DTOs, Services
├── OrgPortal.Infrastructure/ # EF Core, Repositories
└── OrgPortal.API/            # Controllers, JWT, Program.cs

frontend/
└── src/
    ├── api/       # Axios API calls
    ├── pages/     # React pages
    ├── layouts/   # Layout components
    ├── store/     # Zustand state
    └── types/     # TypeScript types
```

## Database Tables
- Companies, Departments, Positions (hierarchical)
- Users, Roles, Permissions, Applications
- PositionRoles, RolePermissions, UserPositions
- UserPermissionOverrides (grant/deny overrides)

## Permission Format
`Application.Module.Action`
Examples: `Portal.Users.View`, `BPM.Process.Create`, `BI.Dashboard.View`
