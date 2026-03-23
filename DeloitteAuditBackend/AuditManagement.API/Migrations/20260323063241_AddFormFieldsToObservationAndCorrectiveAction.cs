using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFormFieldsToObservationAndCorrectiveAction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AreaOrLocation",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Finding",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recommendation",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RiskOrImpact",
                table: "Observations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExpectedOutcome",
                table: "CorrectiveActions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RootCause",
                table: "CorrectiveActions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AreaOrLocation",
                table: "Observations");

            migrationBuilder.DropColumn(
                name: "Finding",
                table: "Observations");

            migrationBuilder.DropColumn(
                name: "Recommendation",
                table: "Observations");

            migrationBuilder.DropColumn(
                name: "RiskOrImpact",
                table: "Observations");

            migrationBuilder.DropColumn(
                name: "ExpectedOutcome",
                table: "CorrectiveActions");

            migrationBuilder.DropColumn(
                name: "RootCause",
                table: "CorrectiveActions");
        }
    }
}
