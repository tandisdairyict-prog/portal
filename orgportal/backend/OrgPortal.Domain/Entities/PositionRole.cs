namespace OrgPortal.Domain.Entities;

public class PositionRole
{
    public int Id { get; set; }
    public int PositionId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public Position Position { get; set; } = default!;
    public Role Role { get; set; } = default!;
}
