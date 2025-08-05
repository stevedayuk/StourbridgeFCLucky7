using Microsoft.EntityFrameworkCore;
using StourbridgeFc.Lucky7.DataContext.Models;

namespace StourbridgeFc.Lucky7.DataContext;

public class Lucky7DataContext : DbContext
{
    public DbSet<Draw> Draws { get; set; }
    public DbSet<DrawWinner> DrawWinners { get; set; }
    public DbSet<Entry> Entries { get; set; }
    public DbSet<Option> Options { get; set; }
    public DbSet<PrizeLevel> PrizeLevels { get; set; }
    
    public Lucky7DataContext(DbContextOptions<Lucky7DataContext> options) : base(options)
    { }
}