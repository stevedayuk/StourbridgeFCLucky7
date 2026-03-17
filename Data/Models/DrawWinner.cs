using System.ComponentModel.DataAnnotations.Schema;

namespace StourbridgeFc.Lucky7.Data.Models;

public class DrawWinner
{
    public int Id { get; set; }
    public int DrawId { get; set; }
    public int PrizeLevelId { get; set; }
    public int EntryId { get; set; }
    public DateTime DateTimeDrawn { get; set; }
    public DateTime? DateTimeRevoked { get; set; }
    
    [NotMapped]
    public bool IsRevoked => DateTimeRevoked.HasValue;

    public Draw Draw { get; set; } = null!;
    public PrizeLevel PrizeLevel { get; set; } = null!;
    public Entry Entry { get; set; } = null!;
    
}