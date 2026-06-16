using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController(IUnitOfWork uow) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? companyId)
    {
        var depts = companyId.HasValue
            ? await uow.Departments.GetByCompanyAsync(companyId.Value)
            : await uow.Departments.GetAllAsync();
        return Ok(depts.Select(d => new DepartmentDto(d.Id, d.CompanyId, d.Company?.Name ?? "", d.ParentDepartmentId, d.Name, d.Code, d.IsActive)));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
    {
        var dept = new Department { CompanyId = dto.CompanyId, ParentDepartmentId = dto.ParentDepartmentId, Name = dto.Name, Code = dto.Code };
        await uow.Departments.AddAsync(dept);
        await uow.SaveChangesAsync();
        return Ok(dept.Id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDepartmentDto dto)
    {
        var d = await uow.Departments.GetByIdAsync(id);
        if (d == null) return NotFound();
        d.ParentDepartmentId = dto.ParentDepartmentId; d.Name = dto.Name; d.Code = dto.Code; d.IsActive = dto.IsActive;
        await uow.Departments.UpdateAsync(d);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var d = await uow.Departments.GetByIdAsync(id);
        if (d == null) return NotFound();
        await uow.Departments.DeleteAsync(d);
        await uow.SaveChangesAsync();
        return NoContent();
    }
}
