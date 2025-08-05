namespace StourbridgeFc.Lucky7.Data.Models;

public class Draw
{
    public int Id { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime DateTimeDrawStartedUtc { get; set; }
    public DateTime DateTimeDrawCompletedUtc { get; set; }

    public ICollection<DrawWinner> DrawWinners { get; set; } = new List<DrawWinner>();
}