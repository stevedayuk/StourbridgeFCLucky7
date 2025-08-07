namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class DrawWinnerDto
{
    public int? Number { get; set; }
    public string? Name { get; set; }
    public int? PrizeLevelId { get; set; }
    public double? PrizeAmount { get; set; }
}