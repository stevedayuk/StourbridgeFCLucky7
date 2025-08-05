using Microsoft.EntityFrameworkCore;
using StourbridgeFc.Lucky7.Data.Models;

namespace StourbridgeFc.Lucky7.Data;

public class Lucky7Context : DbContext
{
    public DbSet<Draw> Draws { get; set; }
    public DbSet<DrawWinner> DrawWinners { get; set; }
    public DbSet<Entry> Entries { get; set; }
    public DbSet<Option> Options { get; set; }
    public DbSet<PrizeLevel> PrizeLevels { get; set; }
    
    public Lucky7Context(DbContextOptions<Lucky7Context> options) : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DrawWinner
        
        modelBuilder.Entity<DrawWinner>()
            .HasOne(p => p.Draw)
            .WithMany(d => d.DrawWinners)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<DrawWinner>()
            .HasOne(p => p.Entry)
            .WithMany(e => e.DrawWinners)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DrawWinner>()
            .HasOne(p => p.PrizeLevel)
            .WithMany(p => p.DrawWinners)
            .OnDelete(DeleteBehavior.Restrict);
    }
}