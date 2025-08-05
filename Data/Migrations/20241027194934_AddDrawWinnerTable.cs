using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace StourbridgeFC.Lucky7.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDrawWinnerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "draw_winners",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    draw_id = table.Column<int>(type: "integer", nullable: false),
                    prize_level_id = table.Column<int>(type: "integer", nullable: false),
                    entry_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_draw_winners", x => x.id);
                    table.ForeignKey(
                        name: "fk_draw_winners_draws_draw_id",
                        column: x => x.draw_id,
                        principalTable: "draws",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_draw_winners_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_draw_winners_prize_levels_prize_level_id",
                        column: x => x.prize_level_id,
                        principalTable: "prize_levels",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_draw_winners_draw_id",
                table: "draw_winners",
                column: "draw_id");

            migrationBuilder.CreateIndex(
                name: "ix_draw_winners_entry_id",
                table: "draw_winners",
                column: "entry_id");

            migrationBuilder.CreateIndex(
                name: "ix_draw_winners_prize_level_id",
                table: "draw_winners",
                column: "prize_level_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "draw_winners");
        }
    }
}
