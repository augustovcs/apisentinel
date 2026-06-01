using Specials.DB.TestingClass;
using Specials.Dev;
using Supabase;
using Services.Consorcio;
using Services.UserService;
using Services.Finance;
using Microsoft.EntityFrameworkCore;
using Services.Dev.Tests;
using Interface.Dev;
using Services.Dev.Pages;
using Product.Services;
using Interface.key;
using Services.GeneralConfigs;
using Interface.general;
using apisentinel_net.Services;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Services.Dev.Executions;
using Services.Dev.Schedules;
using Services.Dev.Logs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

// ─── Swagger config ───────────────────────────────────────────
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "API Sentinel - Backend API",
        Description = "Sistema de monitoramento e automação de APIs",
        Version     = "v1"
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

    Console.WriteLine(
    Assembly.GetExecutingAssembly().GetName().Name
    );

    Console.WriteLine(AppContext.BaseDirectory);

    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    options.TagActionsBy(api =>
    {
        var tag = api.ActionDescriptor.EndpointMetadata
            .OfType<TagsAttribute>()
            .FirstOrDefault()?.Tags.FirstOrDefault();

        return tag != null ? new[] { tag } : new[] { api.GroupName ?? "General" };
    });
});
// ──────────────────────────────────────────────────────────────

builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithOrigins("http://localhost:3000");
        });
});

// SUPABASE CONEXAO
builder.Services.AddScoped<Supabase.Client>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();

    var client = new Supabase.Client(
        config["SupabaseUrl"] ?? throw new ArgumentNullException("SupabaseUrl"),
        config["SupabaseKey"] ?? throw new ArgumentNullException("SupabaseKey"),
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true,
        }
    );

    client.InitializeAsync().Wait();

    return client;
});

// SQL SERVER CONN - EF CORE
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// SERVICES
builder.Services.AddScoped<Consorcio>();
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ITestsService, TestsService>();
builder.Services.AddScoped<IPagesRequest, PagesRequest>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<IApiKeyGeneratorService, ApiKeyGeneratorService>();
builder.Services.AddScoped<IGeneralConfigsService, GeneralConfigsService>();
builder.Services.AddHttpClient<IExecutionsService, ExecutionsService>();
builder.Services.AddScoped<IScheduleService, ScheduleService>();
builder.Services.AddScoped<IExecutionLogService, ExecutionLogService>();
builder.Services.AddScoped<ExecutionLoader>();
builder.Services.AddHostedService<ExecutionScheduler>();

// ---------------------------- //

var open_testing = new DBTestClass(builder.Configuration);
open_testing.ConnDBTesting();

var app = builder.Build();

// ─── Middleware ───────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API Sentinel v1");
        options.RoutePrefix   = "swagger";
        options.DocumentTitle = "API Sentinel Documentation";
        options.DisplayRequestDuration();
        options.EnableDeepLinking();
    });
}
// ──────────────────────────────────────────────────────────────

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();