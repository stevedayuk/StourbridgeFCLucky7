namespace StourbridgeFc.Lucky7.DataContext.Models;

public class Option
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Value { get; set; }
}