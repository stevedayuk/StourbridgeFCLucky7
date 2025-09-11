namespace StourbridgeFc.Lucky7.Data.Models;

public class Entry
{
    public int Id { get; set; }
    public int Number { get; set; }
    public string Name { get; set; } = null!;
    public DateOnly? ActiveFrom { get; set; }
    public DateOnly? ActiveTo { get; set; }
    public DateTime DateTimeAddedUtc { get; set; }
    public DateTime? DateTimeLastUpdatedUtc { get; set; }
    
    public ICollection<DrawWinner> DrawWinners { get; set; } = new List<DrawWinner>();
}