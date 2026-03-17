using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StourbridgeFc.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUtcSuffixFromAllDateTimeProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "date_time_last_updated_utc",
                table: "entries",
                newName: "date_time_last_updated");

            migrationBuilder.RenameColumn(
                name: "date_time_added_utc",
                table: "entries",
                newName: "date_time_added");

            migrationBuilder.RenameColumn(
                name: "date_time_draw_started_utc",
                table: "draws",
                newName: "date_time_draw_started");

            migrationBuilder.RenameColumn(
                name: "date_time_draw_completed_utc",
                table: "draws",
                newName: "date_time_draw_completed");

            migrationBuilder.RenameColumn(
                name: "date_time_drawn_utc",
                table: "draw_winners",
                newName: "date_time_drawn");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "date_time_last_updated",
                table: "entries",
                newName: "date_time_last_updated_utc");

            migrationBuilder.RenameColumn(
                name: "date_time_added",
                table: "entries",
                newName: "date_time_added_utc");

            migrationBuilder.RenameColumn(
                name: "date_time_draw_started",
                table: "draws",
                newName: "date_time_draw_started_utc");

            migrationBuilder.RenameColumn(
                name: "date_time_draw_completed",
                table: "draws",
                newName: "date_time_draw_completed_utc");

            migrationBuilder.RenameColumn(
                name: "date_time_drawn",
                table: "draw_winners",
                newName: "date_time_drawn_utc");
        }
    }
}
