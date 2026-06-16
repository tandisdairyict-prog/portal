namespace OrgPortal.Domain.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string Username { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PersonnelNumber { get; set; }
    public string? NationalId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsAdUser { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public ICollection<UserPosition> UserPositions { get; set; } = [];
    public ICollection<UserPermissionOverride> PermissionOverrides { get; set; } = [];
    public string FullName => $"{FirstName} {LastName}";
}
