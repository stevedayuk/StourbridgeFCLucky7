using Microsoft.AspNetCore.Mvc;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Api.Services;

namespace StourbridgeFc.Lucky7.Api.Controllers;

[Route("draws")]
[ApiController]
public class DrawController : ControllerBase
{
    private readonly DrawService _drawService;

    public DrawController(DrawService drawService)
    {
        _drawService = drawService;
    }

    [HttpGet("current")]
    public async Task<ActionResult<CurrentDrawDto>> GetCurrentDraw()
    {
        CurrentDrawDto currentDraw = await _drawService.GetCurrentDrawAsync();
        return currentDraw;
    }
    
    [HttpGet("current-info")]
    public async Task<ActionResult<CurrentDrawInfoDto>> GetCurrentDrawInfo()
    {
        CurrentDrawInfoDto currentDrawInfo = await _drawService.GetCurrentDrawInfoAsync();
        return currentDrawInfo;
    }
}