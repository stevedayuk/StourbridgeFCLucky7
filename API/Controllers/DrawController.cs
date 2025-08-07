using Microsoft.AspNetCore.Mvc;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Api.Services;
using StourbridgeFc.Lucky7.Data.Models;

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
    
    [HttpPut("complete")]
    public async Task<ActionResult<Draw>> CompleteDraw(CurrentDrawInfoDto currentDrawDto)
    {
        Draw completedDraw = await _drawService.CompleteDrawAsync(currentDrawDto);
        return completedDraw;
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
    
    [HttpGet("test")]
    public async Task<ActionResult<CurrentDrawDto>> GetTestDraw()
    {
        CurrentDrawDto currentDraw = await _drawService.GetTestDrawAsync();
        return currentDraw;
    }

    [HttpPost("set-winner")]
    public async Task<ActionResult<DrawWinner>> SetDrawWinner(SetDrawWinnerDto setDrawWinner)
    {
        DrawWinner drawWinner = await _drawService.SetDrawWinnerAsync(setDrawWinner);
        return drawWinner;
    }

    [HttpPost("start")]
    public async Task<ActionResult<Draw>> StartDraw(CurrentDrawInfoDto currentDrawDto)
    {
        Draw newDraw = await _drawService.StartDrawAsync(currentDrawDto);
        return newDraw;
    }
}