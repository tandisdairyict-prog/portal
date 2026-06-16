namespace OrgPortal.Domain.Entities;

public class Department
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public int? ParentDepartmentId { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Company Company { get; set; } = default!;
    public Department? ParentDepartment { get; set; }
    public ICollection<Department> SubDepartments { get; set; } = [];
    public ICollection<Position> Positions { get; set; } = [];
}
