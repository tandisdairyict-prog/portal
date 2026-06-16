namespace OrgPortal.Domain.Entities;

public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? ShortName { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Department> Departments { get; set; } = [];
}
