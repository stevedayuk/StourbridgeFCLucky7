using System.ComponentModel.DataAnnotations;

namespace StourbridgeFc.Lucky7.DataContext.Models;

public class PrizeLevel
{
    public int Id { get; set; }
    
    [StringLength(60)]
    public string Description { get; set; } = null!;
    
    public double Amount { get; set; }
    public int Winners { get; set; }
    public bool IsActive { get; set; }
}