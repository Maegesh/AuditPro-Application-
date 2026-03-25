using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProofFilePathToObservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProofFilePath",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProofFilePath",
                table: "Observations");
        }
    }
}
