using System.Text;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using StourbridgeFc.Lucky7.Api.DataTransferObjects;
using StourbridgeFc.Lucky7.Data;
using StourbridgeFc.Lucky7.Data.Models;

namespace StourbridgeFc.Lucky7.Api.Services;

public class EntryService
{
    private readonly Lucky7Context _dataContext;

    public EntryService(Lucky7Context dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<List<ParsedDrawEntryDto>?> ParseAndProcessEntriesFromSpreadsheetAsync(IFormFile file,
        int drawMonth,
        int drawYear)
    {
        List<ImportedDrawEntryDto>? importedDrawEntriesList =
            await ParseEntriesFromSpreadsheetAsync(file, drawMonth, drawYear);

        if (importedDrawEntriesList is null)
        {
            return null;
        }

        var processedImportedDrawEntries =
            await ProcessedImportedDrawEntriesAsync(importedDrawEntriesList, drawMonth, drawYear);

        return processedImportedDrawEntries.OrderBy(p => p.Number).ToList();
    }

    public async Task UpdateEntriesAsync(List<ParsedDrawEntryDto> parsedDrawEntriesList, int drawMonth, int drawYear)
    {
        List<Entry> currentEntriesList = await _dataContext.Entries.Where(p => p.ActiveTo == null).ToListAsync();

        DateOnly drawDate = new(drawYear, drawMonth, 1);
        DateOnly activeToDate = drawDate.AddDays(-1);

        foreach (var parsedDrawEntry in parsedDrawEntriesList)
        {
            switch (parsedDrawEntry.State)
            {
                case ParsedEntryState.Unchanged:
                    continue;
                case ParsedEntryState.Added:
                    CreateNewEntry(parsedDrawEntry, drawDate);
                    break;
                case ParsedEntryState.Updated:
                    var currentEntryToBeUpdated =
                        currentEntriesList.FirstOrDefault(p => p.Number == parsedDrawEntry.Number);
                    DeactivateEntry(currentEntryToBeUpdated!, activeToDate);
                    CreateNewEntry(parsedDrawEntry, drawDate);
                    break;
                case ParsedEntryState.Deleted:
                    var currentEntryToBeDeleted =
                        currentEntriesList.FirstOrDefault(p => p.Number == parsedDrawEntry.Number);
                    DeactivateEntry(currentEntryToBeDeleted!, activeToDate);
                    break;
            }
        }

        await _dataContext.SaveChangesAsync();
    }

    private void CreateNewEntry(ParsedDrawEntryDto parsedDrawEntry, DateOnly drawDate)
    {
        Entry newDrawEntry = new()
        {
            Number = parsedDrawEntry.Number,
            Name = parsedDrawEntry.Name,
            ActiveFrom = drawDate,
        };

        _dataContext.Entries.Add(newDrawEntry);
    }

    private void DeactivateEntry(Entry entry, DateOnly activeToDate)
    {
        entry.ActiveTo = activeToDate;
        entry.DateTimeLastUpdatedUtc = DateTime.UtcNow;
    }

    private string GetEntryName(string spreadsheetEntryName, string pascalCaseNameOrder, string upperCaseNameOrder)
    {
        bool isUpperCase = spreadsheetEntryName.All(c => char.IsUpper(c) || char.IsWhiteSpace(c));

        switch (isUpperCase)
        {
            case true when upperCaseNameOrder == OptionConstants.NameOrderSurnameFirst:
            case false when pascalCaseNameOrder == OptionConstants.NameOrderSurnameFirst:
                string[] splitName = spreadsheetEntryName.Split(' ');
                StringBuilder entryName = new();

                foreach (var namePart in splitName[1..])
                {
                    entryName.Append($"{namePart} ");
                }
                
                entryName.Append($"{splitName[0]} ");

                entryName.Length -= 1;

                return entryName.ToString().ToUpper();
            case true when upperCaseNameOrder == OptionConstants.NameOrderAsEntered:
            case false when pascalCaseNameOrder == OptionConstants.NameOrderAsEntered:
                return spreadsheetEntryName.ToUpper();
        }

        throw new InvalidOperationException("Invalid name order.");
    }

    private async Task<List<ImportedDrawEntryDto>?> ParseEntriesFromSpreadsheetAsync(IFormFile file, int drawMonth,
        int drawYear)
    {
        using var stream = file.OpenReadStream();

        XLWorkbook workbook = new(stream);
        IXLWorksheet worksheet = workbook.Worksheet(1);

        IXLRow monthRow = worksheet.Row(2);
        int entryNumberColumnNumber = 1;
        int entryNameColumnNumber = 2;

        int currentMonthColumnNumber = 0;

        DateOnly drawDate = new(drawYear, drawMonth, 1);
        DateOnly paidDate = drawDate.AddMonths(-1);

        IXLCells? monthRowCellsUsed = monthRow.CellsUsed();

        foreach (var cell in monthRowCellsUsed)
        {
            if (currentMonthColumnNumber > 0)
            {
                break;
            }

            bool cellDoubleParsed = double.TryParse(cell.Value.ToString(), out double cellValueDouble);

            if (cellDoubleParsed is false)
            {
                continue;
            }

            DateTime cellValueDate = DateTime.FromOADate(cellValueDouble);

            if (cellValueDate.Month != paidDate.Month || cellValueDate.Year != paidDate.Year)
            {
                continue;
            }

            currentMonthColumnNumber = cell.Address.ColumnNumber;
        }

        if (currentMonthColumnNumber is 0)
        {
            // TODO: Return error state
            return null;
        }

        List<Option> optionsList = await _dataContext.Options.AsNoTracking().Where(p =>
                p.Name == OptionConstants.PascalCaseNameOrder || p.Name == OptionConstants.UpperCaseNameOrder)
            .ToListAsync();
        string pascalCaseNameOrder =
            optionsList.FirstOrDefault(p => p.Name == OptionConstants.PascalCaseNameOrder)!.Value;
        string upperCaseNameOrder =
            optionsList.FirstOrDefault(p => p.Name == OptionConstants.UpperCaseNameOrder)!.Value;

        List<ImportedDrawEntryDto> importedDrawEntriesList = new();

        foreach (var row in worksheet.RowsUsed())
        {
            string entryNumberString = row.Cell(entryNumberColumnNumber).Value.ToString();
            string entryNameString = row.Cell(entryNameColumnNumber).Value.ToString();
            string isPaidString = row.Cell(currentMonthColumnNumber).Value.ToString();

            if (string.IsNullOrWhiteSpace(entryNumberString) || string.IsNullOrWhiteSpace(entryNameString) ||
                string.IsNullOrEmpty(isPaidString) || isPaidString != "√")
            {
                continue;
            }

            int spreadsheetEntryNumber = int.Parse(entryNumberString);
            string spreadsheetEntryName = entryNameString.Trim();
            string entryName = GetEntryName(spreadsheetEntryName, pascalCaseNameOrder, upperCaseNameOrder);

            importedDrawEntriesList.Add(new()
            {
                Number = spreadsheetEntryNumber,
                Name = entryName
            });
        }

        return importedDrawEntriesList;
    }

    private async Task<List<ParsedDrawEntryDto>> ProcessedImportedDrawEntriesAsync(
        List<ImportedDrawEntryDto> importedDrawEntriesList, int drawMonth, int drawYear)
    {
        List<ParsedDrawEntryDto> parsedDrawEntriesList = new();
        List<Entry> currentEntriesList = await _dataContext.Entries.Where(p => p.ActiveTo == null).ToListAsync();

        List<int> importedDrawEntryNumbers = importedDrawEntriesList.Select(p => p.Number).ToList();
        List<int> currentEntryNumbers = currentEntriesList.Select(p => p.Number).ToList();
        List<int> currentEntryNumbersToBeSetAsInactiveList =
            currentEntryNumbers.Except(importedDrawEntryNumbers).ToList();

        foreach (var missingEntryNumber in currentEntryNumbersToBeSetAsInactiveList)
        {
            var currentEntry = currentEntriesList.FirstOrDefault(p => p.Number == missingEntryNumber);

            parsedDrawEntriesList.Add(new()
            {
                Number = missingEntryNumber,
                Name = currentEntry!.Name.ToUpper(),
                State = ParsedEntryState.Deleted
            });
        }

        foreach (var importedDrawEntry in importedDrawEntriesList)
        {
            var currentEntry = currentEntriesList.FirstOrDefault(p => p.Number == importedDrawEntry.Number);

            if (currentEntry is null)
            {
                parsedDrawEntriesList.Add(new()
                {
                    Number = importedDrawEntry.Number,
                    Name = importedDrawEntry.Name.ToUpper(),
                    State = ParsedEntryState.Added
                });
            }
            else
            {
                var state = string.Equals(importedDrawEntry.Name, currentEntry.Name,
                    StringComparison.InvariantCultureIgnoreCase)
                    ? ParsedEntryState.Unchanged
                    : ParsedEntryState.Updated;

                parsedDrawEntriesList.Add(new()
                {
                    Number = importedDrawEntry.Number,
                    Name = importedDrawEntry.Name.ToUpper(),
                    State = state
                });
            }
        }

        return parsedDrawEntriesList;
    }
}