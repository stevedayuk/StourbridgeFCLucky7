namespace StourbridgeFc.Lucky7.Data.Models;

public class DrawWinner
{
    public int Id { get; set; }
    public int DrawId { get; set; }
    public int PrizeLevelId { get; set; }
    public int EntryId { get; set; }
    public DateTime DateTimeDrawnUtc { get; set; }

    public Draw Draw { get; set; } = null!;
    public PrizeLevel PrizeLevel { get; set; } = null!;
    public Entry Entry { get; set; } = null!;
    
}