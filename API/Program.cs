using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using StourbridgeFc.Lucky7.Api.Services;
using StourbridgeFc.Lucky7.Data;

var builder = WebApplication.CreateBuilder(args);
var lucky7Origins = "_lucky7Origins";

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

string databaseConnectionStringKey = builder.Environment.IsDevelopment() ? "SfcLucky7Dev" : "SfcLucky7";

builder.Services.AddDbContextPool<Lucky7Context>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(databaseConnectionStringKey))
        .UseSnakeCaseNamingConvention();
});

builder.Services.AddApiServices();

// Configure Firebase Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Firebase:Authority"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Firebase:Authority"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Firebase:Audience"],
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(lucky7Origins, policy =>
    {
        policy.WithOrigins("https://stourbridgefclucky7.com", "https://www.stourbridgefclucky7.com", "http://localhost:5173")
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();