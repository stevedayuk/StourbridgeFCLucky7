using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StourbridgeFc.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDateTimeAddedUpdatedToEntryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date_time_added_utc",
                table: "entries",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now() at time zone 'utc' ");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_time_last_updated_utc",
                table: "entries",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_time_added_utc",
                table: "entries");

            migrationBuilder.DropColumn(
                name: "date_time_last_updated_utc",
                table: "entries");
        }
    }
}
