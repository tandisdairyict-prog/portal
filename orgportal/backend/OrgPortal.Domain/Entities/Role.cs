namespace OrgPortal.Domain.Entities;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<RolePermission> RolePermissions { get; set; } = [];
    public ICollection<PositionRole> PositionRoles { get; set; } = [];
}
