namespace StourbridgeFc.Lucky7.DataContext.Models;

public class Draw
{
    public int Id { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateOnly DrawDate { get; set; }
    public int DrawnById { get; set; }
}