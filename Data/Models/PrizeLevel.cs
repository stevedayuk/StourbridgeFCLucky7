namespace StourbridgeFc.Lucky7.Data.Models;

public class PrizeLevel
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public double Amount { get; set; }
    public int Winners { get; set; }
    public bool IsActive { get; set; }
    
    public ICollection<DrawWinner> DrawWinners { get; set; } = null!;
}