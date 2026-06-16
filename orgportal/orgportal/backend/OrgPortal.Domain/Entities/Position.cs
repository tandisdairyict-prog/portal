namespace OrgPortal.Domain.Entities;

public class Position
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public int? ParentPositionId { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public int Level { get; set; } = 1;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Department Department { get; set; } = default!;
    public Position? ParentPosition { get; set; }
    public ICollection<Position> SubPositions { get; set; } = [];
    public ICollection<PositionRole> PositionRoles { get; set; } = [];
    public ICollection<UserPosition> UserPositions { get; set; } = [];
}
