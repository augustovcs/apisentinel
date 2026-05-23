// Configurations/SwaggerConfiguration.cs
using Microsoft.OpenApi.Models;
using System.Reflection;

public static class SwaggerConfiguration
{
    public static IServiceCollection AddSwaggerConfig(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title       = "API Sentinel - Backend API",
                Description = "Sistema de monitoramento e automação de APIs",
                Version     = "v1"
            });

            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });

        return services;
    }
}