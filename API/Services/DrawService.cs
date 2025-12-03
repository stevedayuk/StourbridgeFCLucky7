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

        string? numberSelectionTimeString =
            options.FirstOrDefault(p => p.Name == OptionConstants.NumberSelectionTime)?.Value;
        
        if (numberSelectionTimeString is null)
        {
            throw new InvalidOperationException("Number selection time not set in options.");
        }

        if (int.TryParse(numberSelectionTimeString, out int numberSelectionTime) is false)
        {
            throw new InvalidOperationException("Invalid number selection time in options.");
        }

        string drawOrder = options.FirstOrDefault(p => p.Name == OptionConstants.DrawOrder)?.Value ??
                           OptionConstants.DrawOrderLowestFirst;

        CurrentDrawInfoDto currentDrawInfo = await GetCurrentDrawInfoAsync();
        List<DrawEntryDto> drawEntriesList =
            await GetCurrentDrawEntriesAsync(currentDrawInfo.DrawMonth, currentDrawInfo.DrawYear);
        List<DrawWinnerDto> winnersList = await GetCurrentDrawPrizesAsync(drawOrder, drawEntriesList);

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
        
        var currentDrawDetails = await _dataContext.Draws
            .Where(p => p.Month == drawMonth && p.Year == drawYear && p.DateTimeDrawCompletedUtc == null)
            .Select(p => new {p.Id, p.DateTimeDrawCompletedUtc})
            .FirstOrDefaultAsync();
        var currentDrawInProgress =
            currentDrawDetails is { } && currentDrawDetails.DateTimeDrawCompletedUtc.HasValue is false;

        CurrentDrawInfoDto currentDrawInfo = new CurrentDrawInfoDto
        {
            DrawId = currentDrawDetails?.Id,
            DrawMonth = drawMonth,
            DrawYear = drawYear,
            InProgress = currentDrawInProgress
        };

        return currentDrawInfo;
    }
    
    private async Task<List<DrawEntryDto>> GetCurrentDrawEntriesAsync(int drawMonth, int drawYear)
    {
        DateOnly drawDate = new(drawYear, drawMonth, 1);
        
        List<DrawEntryDto> drawEntriesList = await _dataContext.Entries.AsNoTracking()
            .Where(p => p.ActiveFrom <= drawDate && p.ActiveTo == null)
            .Select(p => new DrawEntryDto
            {
                EntryId = p.Id,
                Number = p.Number,
                Name = p.Name,
                IsWinner = false
            }).ToListAsync();

        return drawEntriesList;
    }
    
    private async Task<List<PrizeLevel>> GetPrizeLevelsListAsync()
    {
        List<PrizeLevel> prizeLevelsList =
            await _dataContext.PrizeLevels.AsNoTracking()
                .Where(p => p.IsActive == true)
                .OrderByDescending(p => p.Amount)
                .ToListAsync();
        
        return prizeLevelsList;
    }

    private async Task<List<DrawWinnerDto>> GetTestDrawPrizesAsync(string drawOrder)
    {
        List<PrizeLevel> prizeLevelsList = await GetPrizeLevelsListAsync();
        
        List<DrawWinnerDto> drawPrizesList = new();
        
        foreach (PrizeLevel prizeLevel in prizeLevelsList)
        {
            int totalWinners = prizeLevel.Winners;
        
            for (int c = 0; c < totalWinners; c++)
            {
                DrawWinnerDto drawPrize = new DrawWinnerDto
                {
                    PrizeLevelId = prizeLevel.Id,
                    PrizeAmount = prizeLevel.Amount
                };
        
                drawPrizesList.Add(drawPrize);
            }
        }

        return drawPrizesList;
    }

    private async Task<List<DrawWinnerDto>> GetCurrentDrawPrizesAsync(string drawOrder, List<DrawEntryDto>? drawEntriesList = null)
    {
        List<PrizeLevel> prizeLevelsList = await GetPrizeLevelsListAsync();

        CurrentDrawInfoDto currentDraw = await GetCurrentDrawInfoAsync();
        List<DrawWinner> currentDrawWinnersList = [];

        if (currentDraw.InProgress)
        {
            currentDrawWinnersList = await _dataContext.DrawWinners
                .AsNoTracking()
                .Include(p => p.Entry)
                .Include(p => p.PrizeLevel)
                .Where(p => p.DrawId == currentDraw.DrawId)
                .ToListAsync();

            if (drawEntriesList is not null)
            {
                foreach(var currentDrawWinner in currentDrawWinnersList)
                {
                    var entry = drawEntriesList.FirstOrDefault(e => e.EntryId == currentDrawWinner.EntryId);
                    if (entry is not null)
                    {
                        entry.IsWinner = true;
                    }
                }
            }
        }
        
        List<DrawWinnerDto> drawPrizesList = new();
        
        foreach (PrizeLevel prizeLevel in prizeLevelsList)
        {
            var prizeWinners = currentDrawWinnersList
                .Where(w => w.PrizeLevelId == prizeLevel.Id)
                .ToList();
        
            int totalWinners = prizeLevel.Winners;
            int allocatedWinners = prizeWinners.Count;
        
            for (int c = 0; c < totalWinners; c++)
            {
                DrawWinnerDto drawPrize;
                // For lowest_first, allocate winners to the last entries
                int winnerIndex = drawOrder == OptionConstants.DrawOrderHighestFirst
                    ? c
                    : c - (totalWinners - allocatedWinners);
        
                if (winnerIndex >= 0 && winnerIndex < allocatedWinners)
                {
                    var winner = prizeWinners[winnerIndex];
                    drawPrize = new DrawWinnerDto
                    {
                        Number = winner.Entry.Number,
                        Name = winner.Entry.Name,
                        PrizeLevelId = prizeLevel.Id,
                        PrizeAmount = prizeLevel.Amount
                    };
                }
                else
                {
                    drawPrize = new DrawWinnerDto
                    {
                        PrizeLevelId = prizeLevel.Id,
                        PrizeAmount = prizeLevel.Amount
                    };
                }
        
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
        
        CurrentDrawInfoDto currentDrawInfo = await GetCurrentDrawInfoAsync();
        List<DrawEntryDto> drawEntriesList =
            await GetCurrentDrawEntriesAsync(currentDrawInfo.DrawMonth, currentDrawInfo.DrawYear);
        List<DrawWinnerDto> winnersList = await GetTestDrawPrizesAsync(drawOrder);

        CurrentDrawDto currentDraw = new CurrentDrawDto();
        currentDraw.IsTest = true;
        currentDraw.DrawOrder = drawOrder;
        currentDraw.NumberSelectionTime = numberSelectionTime;
        currentDraw.Entries = drawEntriesList;
        currentDraw.Winners = winnersList;

        return currentDraw;
    }

    public async Task<DrawWinner> SetDrawWinnerAsync(SetDrawWinnerDto setDrawWinner)
    {
        DrawWinner drawWinner = new DrawWinner
        {
            DrawId = setDrawWinner.DrawId,
            PrizeLevelId = setDrawWinner.PrizeLevelId,
            EntryId = setDrawWinner.EntryId,
            DateTimeDrawnUtc = DateTime.UtcNow
        };
        
        _dataContext.DrawWinners.Add(drawWinner);
        await _dataContext.SaveChangesAsync();

        return drawWinner;
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