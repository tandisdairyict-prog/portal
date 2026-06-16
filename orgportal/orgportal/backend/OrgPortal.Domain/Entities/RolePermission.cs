namespace OrgPortal.Domain.Entities;

public class RolePermission
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public Role Role { get; set; } = default!;
    public Permission Permission { get; set; } = default!;
}
