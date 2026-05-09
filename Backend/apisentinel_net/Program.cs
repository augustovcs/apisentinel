using Specials.DB.TestingClass;
using Supabase;
using Services.Consorcio;
//using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();


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

builder.Services.AddScoped<Consorcio>();

var open_testing = new DBTestClass(builder.Configuration);
open_testing.ConnDBTesting();

var app = builder.Build();
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();




app.Run();



