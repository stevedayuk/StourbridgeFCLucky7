using Microsoft.EntityFrameworkCore;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Data;
using StourbridgeFc.Lucky7.Data.Models;

namespace StourbridgeFc.Lucky7.Api.Services;

public class DrawService
{
    private readonly Lucky7Context _dataContext;

    public DrawService(Lucky7Context dataContext)
    {
        _dataContext = dataContext;
    }
    
    public async Task<Draw> CompleteDrawAsync(CurrentDrawInfoDto currentDrawInfo)
    {
        Draw? existingDraw = await _dataContext.Draws
            .FirstOrDefaultAsync(p => p.Month == currentDrawInfo.DrawMonth && p.Year == currentDrawInfo.DrawYear);

        if (existingDraw is null)
        {
            throw new InvalidOperationException("No draw found for the specified month and year.");
        }

        existingDraw.DateTimeDrawCompletedUtc = DateTime.UtcNow;
        
        DateOnly nextDrawDate = new DateOnly(currentDrawInfo.DrawYear, currentDrawInfo.DrawMonth, 1).AddMonths(1);
        
        List<Option> nextDrawOptions = await _dataContext.Options
            .Where(o => o.Name == OptionConstants.NextDrawMonth || o.Name == OptionConstants.NextDrawYear)
            .ToListAsync();

        foreach (var option in nextDrawOptions)
        {
            option.Value = option.Name switch
            {
                OptionConstants.NextDrawMonth => nextDrawDate.Month.ToString(),
                OptionConstants.NextDrawYear => nextDrawDate.Year.ToString(),
                _ => option.Value
            };
        }
        
        await _dataContext.SaveChangesAsync();

        return existingDraw;
    }
    
    public async Task<CurrentDrawDto> GetCurrentDrawAsync()
    {
        List<Option> options = await _dataContext.Options.AsNoTracking().ToListAsync();

        string? drawMonthString = options.FirstOrDefault(p => p.Name == OptionConstants.NextDrawMonth)?.Value;
        string? drawYearString = options.FirstOrDefault(p => p.Name == OptionConstants.NextDrawYear)?.Value;
        string? numberSelectionTimeString =
            options.FirstOrDefault(p => p.Name == OptionConstants.NumberSelectionTime)?.Value;
        if (drawMonthString is null || drawYearString is null || numberSelectionTimeString is null)
        {
            throw new InvalidOperationException("Next draw month, year or number selection time not set in options.");
        }

        if (int.TryParse(drawMonthString, out int drawMonth) is false ||
            int.TryParse(drawYearString, out int drawYear) is false ||
            int.TryParse(numberSelectionTimeString, out int numberSelectionTime) is false)
        {
            throw new InvalidOperationException("Invalid next draw month or year format in options.");
        }

        string drawOrder = options.FirstOrDefault(p => p.Name == OptionConstants.DrawOrder)?.Value ??
                           OptionConstants.DrawOrderLowestFirst;

        CurrentDrawInfoDto currentDrawInfo = await GetCurrentDrawInfoAsync();
        List<DrawEntryDto> drawEntriesList = await GetDrawEntriesAsync();
        List<DrawWinnerDto> winnersList = await GetDrawPrizesAsync(drawOrder);

        CurrentDrawDto currentDraw = new CurrentDrawDto();
        currentDraw.DrawInfo = currentDrawInfo;
        currentDraw.DrawOrder = drawOrder;
        currentDraw.NumberSelectionTime = numberSelectionTime;
        currentDraw.Entries = drawEntriesList;
        currentDraw.Winners = winnersList;

        return currentDraw;
    }

    public async Task<CurrentDrawInfoDto> GetCurrentDrawInfoAsync()
    {
        List<Option> options = await _dataContext.Options.AsNoTracking().ToListAsync();

        string? drawMonthString = options.FirstOrDefault(p => p.Name == OptionConstants.NextDrawMonth)?.Value;
        string? drawYearString = options.FirstOrDefault(p => p.Name == OptionConstants.NextDrawYear)?.Value;

        if (drawMonthString is null || drawYearString is null)
        {
            throw new InvalidOperationException("Next draw month or year not set in options.");
        }

        if (int.TryParse(drawMonthString, out int drawMonth) is false ||
            int.TryParse(drawYearString, out int drawYear) is false)
        {
            throw new InvalidOperationException("Invalid next draw month or year format in options.");
        }

        CurrentDrawInfoDto currentDrawInfo = new CurrentDrawInfoDto
        {
            DrawMonth = drawMonth,
            DrawYear = drawYear
        };

        return currentDrawInfo;
    }
    
    private async Task<List<DrawEntryDto>> GetDrawEntriesAsync()
    {
        List<DrawEntryDto> drawEntriesList = await _dataContext.Entries.AsNoTracking()
            .Select(p => new DrawEntryDto
            {
                Number = p.Number,
                Name = p.Name,
                IsWinner = false
            }).ToListAsync();

        return drawEntriesList;
    }

    private async Task<List<DrawWinnerDto>> GetDrawPrizesAsync(string drawOrder)
    {
        List<PrizeLevel> prizeLevelsList =
            await _dataContext.PrizeLevels.AsNoTracking()
                .Where(p => p.IsActive == true)
                .OrderByDescending(p => p.Amount)
                .ToListAsync();

        List<DrawWinnerDto> drawPrizesList = new();

        foreach (PrizeLevel prizeLevel in prizeLevelsList)
        {
            for (int c = 0; c < prizeLevel.Winners; c++)
            {
                DrawWinnerDto drawPrize = new DrawWinnerDto
                {
                    PrizeAmount = prizeLevel.Amount
                };

                drawPrizesList.Add(drawPrize);
            }
        }

        return drawPrizesList;
    }
    
    public async Task<CurrentDrawDto> GetTestDrawAsync()
    {
        List<Option> options = await _dataContext.Options.AsNoTracking().ToListAsync();
        
        string? numberSelectionTimeString =
            options.FirstOrDefault(p => p.Name == OptionConstants.NumberSelectionTime)?.Value;
        if (numberSelectionTimeString is null)
        {
            throw new InvalidOperationException("Number selection time not set in options.");
        }

        if (int.TryParse(numberSelectionTimeString, out int numberSelectionTime) is false)
        {
            throw new InvalidOperationException("Invalid next draw month or year format in options.");
        }
        
        string drawOrder = options.FirstOrDefault(p => p.Name == OptionConstants.DrawOrder)?.Value ??
                           OptionConstants.DrawOrderLowestFirst;
        
        List<DrawEntryDto> drawEntriesList = await GetDrawEntriesAsync();
        List<DrawWinnerDto> winnersList = await GetDrawPrizesAsync(drawOrder);

        CurrentDrawDto currentDraw = new CurrentDrawDto();
        currentDraw.IsTest = true;
        currentDraw.DrawOrder = drawOrder;
        currentDraw.NumberSelectionTime = numberSelectionTime;
        currentDraw.Entries = drawEntriesList;
        currentDraw.Winners = winnersList;

        return currentDraw;
    }
    
    public async Task<Draw> StartDrawAsync(CurrentDrawInfoDto currentDrawInfo)
    {
        Draw newDraw = new Draw
        {
            Month = currentDrawInfo.DrawMonth,
            Year = currentDrawInfo.DrawYear,
            DateTimeDrawStartedUtc = DateTime.UtcNow,
        };
        
        _dataContext.Draws.Add(newDraw);
        await _dataContext.SaveChangesAsync();

        return newDraw;
    }
}