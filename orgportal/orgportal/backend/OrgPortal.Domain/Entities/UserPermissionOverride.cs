namespace OrgPortal.Domain.Entities;

public class UserPermissionOverride
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PermissionId { get; set; }
    public bool IsGranted { get; set; }
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public AppUser User { get; set; } = default!;
    public Permission Permission { get; set; } = default!;
}
