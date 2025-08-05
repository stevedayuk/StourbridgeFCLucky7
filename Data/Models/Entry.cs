namespace StourbridgeFc.Lucky7.Data.Models;

public class Entry
{
    public int Id { get; set; }
    public int Number { get; set; }
    public string Name { get; set; } = null!;
    
    public ICollection<DrawWinner> DrawWinners { get; set; } = new List<DrawWinner>();
}