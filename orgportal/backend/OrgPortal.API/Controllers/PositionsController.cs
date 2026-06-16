using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PositionsController(IUnitOfWork uow, IOrgChartService orgChart) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PositionDto>>> GetAll()
    {
        var positions = await uow.Positions.GetAllAsync();
        return Ok(positions.Select(p => new PositionDto(p.Id, p.DepartmentId, "", p.ParentPositionId, null, p.Title, p.Description, p.Level, p.IsActive, [], [])));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PositionDto>> Get(int id)
    {
        var p = await uow.Positions.GetWithRolesAsync(id);
        if (p == null) return NotFound();
        return Ok(MapDto(p));
    }

    [HttpGet("tree")]
    public async Task<ActionResult<List<PositionTreeDto>>> GetTree() =>
        Ok(await orgChart.GetOrgChartAsync());

    [HttpPost]
    public async Task<ActionResult<PositionDto>> Create([FromBody] CreatePositionDto dto)
    {
        var pos = new Position { DepartmentId = dto.DepartmentId, ParentPositionId = dto.ParentPositionId, Title = dto.Title, Description = dto.Description };
        await uow.Positions.AddAsync(pos);
        await uow.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = pos.Id },
            new PositionDto(pos.Id, pos.DepartmentId, "", pos.ParentPositionId, null, pos.Title, pos.Description, pos.Level, pos.IsActive, [], []));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePositionDto dto)
    {
        var p = await uow.Positions.GetByIdAsync(id);
        if (p == null) return NotFound();
        p.ParentPositionId = dto.ParentPositionId; p.Title = dto.Title; p.Description = dto.Description; p.IsActive = dto.IsActive;
        await uow.Positions.UpdateAsync(p);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/move")]
    public async Task<IActionResult> Move(int id, [FromBody] MovePositionDto dto)
    {
        await orgChart.MovePositionAsync(id, dto.NewParentPositionId);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await uow.Positions.GetByIdAsync(id);
        if (p == null) return NotFound();
        await uow.Positions.DeleteAsync(p);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    private static PositionDto MapDto(Position p) =>
        new(p.Id, p.DepartmentId, p.Department?.Name ?? "", p.ParentPositionId, p.ParentPosition?.Title,
            p.Title, p.Description, p.Level, p.IsActive,
            p.PositionRoles.Select(pr => new RoleDto(pr.Role.Id, pr.Role.Name, pr.Role.Description, pr.Role.IsActive, pr.Role.CreatedAt, [])).ToList(),
            p.UserPositions.Where(up => up.IsActive).Select(up => new UserSummaryDto(up.User.Id, up.User.FullName, up.User.AvatarUrl, up.User.PersonnelNumber)).ToList());
}
