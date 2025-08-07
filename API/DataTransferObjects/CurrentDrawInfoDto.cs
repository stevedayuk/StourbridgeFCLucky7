namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class CurrentDrawInfoDto
{
    public int? DrawId { get; set; }
    public int DrawMonth { get; set; }
    public int DrawYear { get; set; }
    public bool InProgress { get; set; }
}