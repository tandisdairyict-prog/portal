using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController(IUnitOfWork uow) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleSummaryDto>>> GetAll()
    {
        var roles = await uow.Roles.GetActiveRolesAsync();
        return Ok(roles.Select(r => new RoleSummaryDto(r.Id, r.Name, r.IsActive)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleDto>> Get(int id)
    {
        var r = await uow.Roles.GetWithPermissionsAsync(id);
        if (r == null) return NotFound();
        return Ok(MapDto(r));
    }

    [HttpPost]
    public async Task<ActionResult<RoleSummaryDto>> Create([FromBody] CreateRoleDto dto)
    {
        var role = new Role { Name = dto.Name, Description = dto.Description };
        await uow.Roles.AddAsync(role);
        await uow.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = role.Id }, new RoleSummaryDto(role.Id, role.Name, role.IsActive));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoleDto dto)
    {
        var r = await uow.Roles.GetByIdAsync(id);
        if (r == null) return NotFound();
        r.Name = dto.Name; r.Description = dto.Description; r.IsActive = dto.IsActive;
        await uow.Roles.UpdateAsync(r);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/permissions")]
    public async Task<IActionResult> AssignPermissions(int id, [FromBody] AssignRolePermissionsDto dto)
    {
        var role = await uow.Roles.GetWithPermissionsAsync(id);
        if (role == null) return NotFound();

        var currentIds = role.RolePermissions.Select(rp => rp.PermissionId).ToHashSet();

        foreach (var permId in dto.PermissionIds.Except(currentIds))
            await uow.Roles.AssignPermissionAsync(id, permId);

        foreach (var permId in currentIds.Except(dto.PermissionIds))
            await uow.Roles.RemovePermissionAsync(id, permId);

        await uow.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id}/clone")]
    public async Task<ActionResult<RoleSummaryDto>> Clone(int id, [FromBody] CloneRoleDto dto)
    {
        var clone = await uow.Roles.CloneRoleAsync(id, dto.NewName);
        if (clone == null) return NotFound();
        await uow.SaveChangesAsync();
        return Ok(new RoleSummaryDto(clone.Id, clone.Name, clone.IsActive));
    }

    private static RoleDto MapDto(Role r) =>
        new(r.Id, r.Name, r.Description, r.IsActive, r.CreatedAt,
            r.RolePermissions.Select(rp => new PermissionDto(
                rp.Permission.Id, rp.Permission.ApplicationId,
                rp.Permission.Application?.Code ?? "",
                rp.Permission.Application?.Name ?? "",
                rp.Permission.Name, rp.Permission.Module, rp.Permission.Action, rp.Permission.Description
            )).ToList());
}
