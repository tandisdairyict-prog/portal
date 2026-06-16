using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController(IUnitOfWork uow) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetAll()
    {
        var apps = await uow.Applications.GetActiveApplicationsAsync();
        return Ok(apps.Select(a => new ApplicationDto(a.Id, a.Name, a.Code, a.Description, a.IconClass, a.Url, a.IsActive, a.Order)));
    }
}
