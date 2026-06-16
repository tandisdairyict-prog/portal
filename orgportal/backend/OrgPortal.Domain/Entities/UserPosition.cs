namespace OrgPortal.Domain.Entities;

public class UserPosition
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PositionId { get; set; }
    public bool IsPrimary { get; set; } = true;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public AppUser User { get; set; } = default!;
    public Position Position { get; set; } = default!;
}
