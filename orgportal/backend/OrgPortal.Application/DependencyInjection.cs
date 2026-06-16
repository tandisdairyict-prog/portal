using Microsoft.Extensions.DependencyInjection;
using OrgPortal.Application.Interfaces;
using OrgPortal.Application.Services;

namespace OrgPortal.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPermissionService, PermissionService>();
        services.AddScoped<IOrgChartService, OrgChartService>();
        return services;
    }
}
