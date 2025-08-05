namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class DrawEntryDto
{
    public int Number { get; set; }
    public string Name { get; set; } = null!;
    public bool IsWinner { get; set; }
}