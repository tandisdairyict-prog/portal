namespace OrgPortal.Domain.Entities;

public class Application
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string? Description { get; set; }
    public string? IconClass { get; set; }
    public string? Url { get; set; }
    public bool IsActive { get; set; } = true;
    public int Order { get; set; }
    public ICollection<Permission> Permissions { get; set; } = [];
}
