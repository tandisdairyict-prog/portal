using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(IUnitOfWork uow, IPermissionService permService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await uow.Users.GetAllAsync();
        return Ok(users.Select(MapDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> Get(int id)
    {
        var u = await uow.Users.GetWithPositionsAsync(id);
        if (u == null) return NotFound();
        return Ok(MapDtoWithPositions(u));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        var user = new AppUser
        {
            Username = dto.Username, Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName, LastName = dto.LastName,
            PersonnelNumber = dto.PersonnelNumber, NationalId = dto.NationalId,
            PhoneNumber = dto.PhoneNumber
        };
        await uow.Users.AddAsync(user);
        await uow.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = user.Id }, MapDto(user));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var u = await uow.Users.GetByIdAsync(id);
        if (u == null) return NotFound();
        u.Email = dto.Email; u.FirstName = dto.FirstName; u.LastName = dto.LastName;
        u.PersonnelNumber = dto.PersonnelNumber; u.NationalId = dto.NationalId;
        u.PhoneNumber = dto.PhoneNumber; u.IsActive = dto.IsActive;
        await uow.Users.UpdateAsync(u);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var u = await uow.Users.GetByIdAsync(id);
        if (u == null) return NotFound();
        await uow.Users.DeleteAsync(u);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/permissions")]
    public async Task<ActionResult<UserPermissionsDto>> GetPermissions(int id)
    {
        var user = await uow.Users.GetByIdAsync(id);
        if (user == null) return NotFound();
        var perms = await permService.GetUserPermissionsAsync(id);
        return Ok(new UserPermissionsDto(id, user.FullName, perms));
    }

    [HttpGet("{id}/permissions/tree")]
    public async Task<ActionResult<List<PermissionTreeDto>>> GetPermissionTree(int id)
    {
        var tree = await permService.GetUserPermissionTreeAsync(id);
        return Ok(tree);
    }

    [HttpGet("{id}/manager")]
    public async Task<ActionResult<ManagerDto>> GetManager(int id)
    {
        var manager = await uow.Users.GetDirectManagerAsync(id);
        if (manager == null) return NotFound(new { message = "مدیر مستقیم یافت نشد" });
        return Ok(new ManagerDto(manager.Id, manager.FullName, ""));
    }

    private static UserDto MapDto(AppUser u) =>
        new(u.Id, u.Username, u.Email, u.FirstName, u.LastName, u.FullName,
            u.PersonnelNumber, u.NationalId, u.PhoneNumber, u.AvatarUrl,
            u.IsActive, u.IsAdUser, u.CreatedAt, u.LastLoginAt, []);

    private static UserDto MapDtoWithPositions(AppUser u) =>
        new(u.Id, u.Username, u.Email, u.FirstName, u.LastName, u.FullName,
            u.PersonnelNumber, u.NationalId, u.PhoneNumber, u.AvatarUrl,
            u.IsActive, u.IsAdUser, u.CreatedAt, u.LastLoginAt,
            u.UserPositions.Where(up => up.IsActive).Select(up =>
                new UserPositionDto(up.PositionId, up.Position?.Title ?? "", up.Position?.Department?.Name ?? "",
                    up.Position?.Department?.Company?.Name ?? "", up.IsPrimary, up.IsActive)).ToList());
}
