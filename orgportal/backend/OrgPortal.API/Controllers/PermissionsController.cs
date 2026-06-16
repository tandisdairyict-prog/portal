using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PermissionsController(IUnitOfWork uow, IPermissionService permService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAll()
    {
        var perms = await uow.Permissions.GetTreeAsync();
        return Ok(perms.Select(p => new PermissionDto(p.Id, p.ApplicationId, p.Application?.Code ?? "", p.Application?.Name ?? "", p.Name, p.Module, p.Action, p.Description)));
    }

    [HttpGet("tree")]
    public async Task<ActionResult<List<PermissionTreeDto>>> GetTree() =>
        Ok(await permService.GetPermissionTreeAsync());

    [HttpPost("overrides")]
    public async Task<IActionResult> SetOverride([FromBody] SetPermissionOverrideDto dto)
    {
        await permService.SetPermissionOverrideAsync(dto);
        return Ok();
    }

    [HttpDelete("overrides/{userId}/{permissionId}")]
    public async Task<IActionResult> RemoveOverride(int userId, int permissionId)
    {
        await permService.RemovePermissionOverrideAsync(userId, permissionId);
        return Ok();
    }
}
