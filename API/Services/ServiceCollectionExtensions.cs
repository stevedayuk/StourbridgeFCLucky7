namespace StourbridgeFc.Lucky7.Api.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddScoped<DrawService>();
        services.AddScoped<EntryService>();
        services.AddScoped<WinnersService>();

        return services;
    }
}