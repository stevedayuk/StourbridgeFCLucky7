namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class PublicWinnersDto
{
    public List<PublicDrawDto> Draws { get; set; } = null!;
    public List<PublicWinnerDto> CurrentDrawWinners { get; set; } = null!;
}