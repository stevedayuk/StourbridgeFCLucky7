using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StourbridgeFc.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEntryActiveDateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "active_from",
                table: "entries",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "active_to",
                table: "entries",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "active_from",
                table: "entries");

            migrationBuilder.DropColumn(
                name: "active_to",
                table: "entries");
        }
    }
}
