using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuditManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class AddExpertiseToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Expertise",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expertise",
                table: "Users");
        }
    }
}
