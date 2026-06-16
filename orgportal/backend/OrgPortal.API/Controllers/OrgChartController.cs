using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrgChartController(IOrgChartService orgChart) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PositionTreeDto>>> Get([FromQuery] int? companyId) =>
        Ok(await orgChart.GetOrgChartAsync(companyId));

    [HttpGet("manager/{userId}")]
    public async Task<ActionResult<ManagerDto>> GetManager(int userId)
    {
        var manager = await orgChart.GetDirectManagerAsync(userId);
        if (manager == null) return NotFound();
        return Ok(manager);
    }

    [HttpGet("subordinates/{userId}")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetSubordinates(int userId) =>
        Ok(await orgChart.GetSubordinatesAsync(userId));
}
