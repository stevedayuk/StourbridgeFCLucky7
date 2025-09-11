namespace StourbridgeFc.Lucky7.Api.DataTransferObjects;

public class ParsedDrawEntryDto
{
    public int Number { get; set; }
    public string Name { get; set; } = null!;
    public ParsedEntryState State { get; set; }
}