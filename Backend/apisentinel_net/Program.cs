using Specials.DB.TestingClass;
using Supabase;
using Services.Consorcio;
using Services.UserService;
using Services.Finance;
using Microsoft.EntityFrameworkCore;

//using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();


//CORS
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


//SUPABASE CONEXAO
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

    // 🔥 ESSENCIAL: inicializa no próprio ciclo do DI
    client.InitializeAsync().Wait();

    return client;
});

//SQL SERVER CONN - EF CORE
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

builder.Services.AddScoped<Consorcio>();
builder.Services.AddScoped<FinancialOperations>();
builder.Services.AddScoped<UserService>();

var open_testing = new DBTestClass(builder.Configuration);
open_testing.ConnDBTesting();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();





app.Run();



