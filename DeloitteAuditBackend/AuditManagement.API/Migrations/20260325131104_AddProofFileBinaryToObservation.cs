using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProofFileBinaryToObservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProofFilePath",
                table: "Observations");

            migrationBuilder.AddColumn<byte[]>(
                name: "ProofFileData",
                table: "Observations",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProofFileName",
                table: "Observations",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProofFileData",
                table: "Observations");

            migrationBuilder.DropColumn(
                name: "ProofFileName",
                table: "Observations");

            migrationBuilder.AddColumn<string>(
                name: "ProofFilePath",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
