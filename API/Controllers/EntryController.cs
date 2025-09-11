using Microsoft.AspNetCore.Mvc;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Api.Services;

namespace StourbridgeFc.Lucky7.Api.Controllers;

[Route("entries")]
[ApiController]
public class EntryController : ControllerBase
{
    private readonly EntryService _entryService;

    public EntryController(EntryService entryService)
    {
        _entryService = entryService;
    }
    
    [HttpPost("parse-process-from-spreadsheet")]
    public async Task<ActionResult<List<ParsedDrawEntryDto>?>> ParseAndProcessEntries(IFormFile file, [FromQuery] int drawMonth, [FromQuery] int drawYear)
    {
        List<ParsedDrawEntryDto>? parsedDrawEntriesList = await _entryService.ParseAndProcessEntriesFromSpreadsheetAsync(file, drawMonth, drawYear);
        return parsedDrawEntriesList;
    }

    [HttpPut("update-entries")]
    public async Task<IActionResult> UpdateEntries(List<ParsedDrawEntryDto> entries, int drawMonth, int drawYear)
    {
        await _entryService.UpdateEntriesAsync(entries, drawMonth, drawYear);
        return Ok();
    }
}