using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StourbridgeFc.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDateTimeRevokedToDrawWinner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date_time_revoked",
                table: "draw_winners",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_time_revoked",
                table: "draw_winners");
        }
    }
}
