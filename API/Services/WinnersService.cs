using Microsoft.EntityFrameworkCore;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Data;

namespace StourbridgeFc.Lucky7.Api.Services;

public class WinnersService
{
    private readonly Lucky7Context _dataContext;

    public WinnersService(Lucky7Context dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<PublicWinnersDto> GetDisplayWinnersAsync()
    {
        PublicWinnersDto publicWinners = new PublicWinnersDto();
        
        List<PublicDrawDto> draws = await _dataContext.Draws.Select(p => new PublicDrawDto
        {
            Month = p.Month,
            Year = p.Year,
        }).ToListAsync();
        
        publicWinners.Draws = draws;
        
        var currentDraw = draws.OrderByDescending(p => p.Year).ThenByDescending(p => p.Month).FirstOrDefault();

        if (currentDraw is null)
        {
            return publicWinners;
        }

        List<PublicWinnerDto> currentDrawWinners = await GetDisplayWinnersAsync(currentDraw.Month, currentDraw.Year);
        publicWinners.CurrentDrawWinners = currentDrawWinners;
        
        return publicWinners;
    }

    public async Task<List<PublicWinnerDto>> GetDisplayWinnersAsync(int month, int year)
    {
        var x = await _dataContext.DrawWinners
            .Include(e => e.Entry)
            .Include(e => e.PrizeLevel)
            // .Where(e => e.Draw.Month == month && e.Draw.Year == year)
            .ToListAsync();
        
        List<PublicWinnerDto> currentDrawWinners = await _dataContext.DrawWinners
            .Include(e => e.Entry)
            .Include(e => e.PrizeLevel)
            .Where(e => e.Draw.Month == month && e.Draw.Year == year)
            .OrderByDescending(p => p.PrizeLevel.Amount).ThenByDescending(p => p.Id)
            .Select(p => new PublicWinnerDto
            {
                PrizeAmount = p.PrizeLevel.Amount,
                Number = p.Entry.Number,
                Name = p.Entry.Name
            }).ToListAsync();
        
        return currentDrawWinners;
    }
}