using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLakeShoreDrive.Engagement.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialEngagementSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Engagements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClientName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    BusinessProblem = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    CurrentStateSummary = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    TargetStateSummary = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    TimelineStartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TimelineTargetEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Confidentiality = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ArchivedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    BusinessObjectives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KnownTechnologyLandscape = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Constraints = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedDeliverables = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Engagements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EngagementLifecycleTransitions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromStatus = table.Column<int>(type: "int", nullable: false),
                    ToStatus = table.Column<int>(type: "int", nullable: false),
                    PerformedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    OccurredAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    EngagementId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngagementLifecycleTransitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngagementLifecycleTransitions_Engagements_EngagementId",
                        column: x => x.EngagementId,
                        principalTable: "Engagements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EngagementStakeholders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: true),
                    EngagementId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EngagementStakeholders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EngagementStakeholders_Engagements_EngagementId",
                        column: x => x.EngagementId,
                        principalTable: "Engagements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EngagementLifecycleTransitions_EngagementId_OccurredAtUtc",
                table: "EngagementLifecycleTransitions",
                columns: new[] { "EngagementId", "OccurredAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Engagements_ClientId",
                table: "Engagements",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Engagements_Status_CreatedAtUtc",
                table: "Engagements",
                columns: new[] { "Status", "CreatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_EngagementStakeholders_EngagementId",
                table: "EngagementStakeholders",
                column: "EngagementId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EngagementLifecycleTransitions");

            migrationBuilder.DropTable(
                name: "EngagementStakeholders");

            migrationBuilder.DropTable(
                name: "Engagements");
        }
    }
}
