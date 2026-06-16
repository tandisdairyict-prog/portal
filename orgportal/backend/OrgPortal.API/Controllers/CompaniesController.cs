using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrgPortal.Application.DTOs;
using OrgPortal.Application.Interfaces;
using OrgPortal.Domain.Entities;

namespace OrgPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController(IUnitOfWork uow) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAll()
    {
        var companies = await uow.Companies.GetActiveCompaniesAsync();
        return Ok(companies.Select(c => new CompanyDto(c.Id, c.Name, c.ShortName, c.LogoUrl, c.IsActive, c.CreatedAt)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> Get(int id)
    {
        var c = await uow.Companies.GetByIdAsync(id);
        if (c == null) return NotFound();
        return Ok(new CompanyDto(c.Id, c.Name, c.ShortName, c.LogoUrl, c.IsActive, c.CreatedAt));
    }

    [HttpPost]
    public async Task<ActionResult<CompanyDto>> Create([FromBody] CreateCompanyDto dto)
    {
        var company = new Company { Name = dto.Name, ShortName = dto.ShortName, LogoUrl = dto.LogoUrl };
        await uow.Companies.AddAsync(company);
        await uow.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = company.Id },
            new CompanyDto(company.Id, company.Name, company.ShortName, company.LogoUrl, company.IsActive, company.CreatedAt));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyDto dto)
    {
        var c = await uow.Companies.GetByIdAsync(id);
        if (c == null) return NotFound();
        c.Name = dto.Name; c.ShortName = dto.ShortName; c.LogoUrl = dto.LogoUrl; c.IsActive = dto.IsActive;
        await uow.Companies.UpdateAsync(c);
        await uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await uow.Companies.GetByIdAsync(id);
        if (c == null) return NotFound();
        await uow.Companies.DeleteAsync(c);
        await uow.SaveChangesAsync();
        return NoContent();
    }
}
