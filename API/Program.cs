using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using StourbridgeFc.Lucky7.Api.Services;
using StourbridgeFc.Lucky7.Data;

var builder = WebApplication.CreateBuilder(args);
var lucky7Origins = "_lucky7Origins";

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<Lucky7Context>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Lucky7DataContext"))
        .UseSnakeCaseNamingConvention();
});
builder.Services.AddApiServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy(lucky7Origins, policy =>
    {
        policy.WithOrigins("https://sfclucky7.app", "https://r2.sfclucky7.app", "http://localhost:5173")
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .WithHeaders("Authorization", "Content-Type")
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(lucky7Origins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();