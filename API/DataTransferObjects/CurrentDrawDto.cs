namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class CurrentDrawDto
{
    public CurrentDrawInfoDto DrawInfo { get; set; } = null!;
    public string DrawOrder { get; set; } = null!;
    public int NumberSelectionTime { get; set; }
    public List<DrawEntryDto> Entries { get; set; } = null!;
    public List<DrawWinnerDto> Winners { get; set; } = null!;
}