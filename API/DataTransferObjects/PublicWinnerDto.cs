namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class PublicWinnerDto
{
    public double PrizeAmount { get; set; }
    public int Number { get; set; }
    public string Name { get; set; } = null!;
}