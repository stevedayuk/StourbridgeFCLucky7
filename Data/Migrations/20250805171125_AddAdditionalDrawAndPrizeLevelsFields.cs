using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StourbridgeFc.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAdditionalDrawAndPrizeLevelsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "date_time_drawn_utc",
                table: "draws",
                newName: "date_time_draw_started_utc");

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "prize_levels",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "date_time_draw_completed_utc",
                table: "draws",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_active",
                table: "prize_levels");

            migrationBuilder.DropColumn(
                name: "date_time_draw_completed_utc",
                table: "draws");

            migrationBuilder.RenameColumn(
                name: "date_time_draw_started_utc",
                table: "draws",
                newName: "date_time_drawn_utc");
        }
    }
}
