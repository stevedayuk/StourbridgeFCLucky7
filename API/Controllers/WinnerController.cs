using Microsoft.AspNetCore.Mvc;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Api.Services;

namespace StourbridgeFc.Lucky7.Api.Controllers;

[Route("winners")]
[ApiController]
public class WinnerController : ControllerBase
{
    private readonly WinnersService _winnersService;

    public WinnerController(WinnersService winnersService)
    {
        _winnersService = winnersService;
    }

    [HttpGet]
    public async Task<ActionResult<PublicWinnersDto>> GetDisplayWinners()
    {
        PublicWinnersDto publicWinners = await _winnersService.GetDisplayWinnersAsync();
        return publicWinners;
    }

    [HttpGet("draw")]
    public async Task<ActionResult<List<PublicWinnerDto>>> GetDrawDisplayWinners(int month, int year)
    {
        List<PublicWinnerDto> publicWinners = await _winnersService.GetDisplayWinnersAsync(month, year);
        return publicWinners;   
    }
}