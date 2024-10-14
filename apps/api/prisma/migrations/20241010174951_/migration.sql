-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'STAFF', 'USER');

-- CreateEnum
CREATE TYPE "ReprotType" AS ENUM ('NORMAL', 'EVENT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('WAITING', 'RE_OPEN', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReportApprovalStatus" AS ENUM ('WAITING', 'APPROVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "mobile" TEXT,
    "failLoginCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "reportWorkflowId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forget_passwords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forget_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_teams" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,

    CONSTRAINT "workspace_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_categories" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "billing_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_categories" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "report_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_line_approves" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,

    CONSTRAINT "workflow_line_approves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mapLat" DOUBLE PRECISION,
    "mapLng" DOUBLE PRECISION,
    "reportLevel" INTEGER,
    "step" INTEGER NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_approvals" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportApprovalStatus" NOT NULL,
    "step" INTEGER NOT NULL,
    "isHistory" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "fullPath" TEXT NOT NULL,
    "reportApprovalId" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "message" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReportToReportCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileToReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "users_email_username_idx" ON "users"("email", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_email_key" ON "users"("username", "email");

-- CreateIndex
CREATE INDEX "forget_passwords_userId_idx" ON "forget_passwords"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "report_categories_workflowId_key" ON "report_categories"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "_ReportToReportCategory_AB_unique" ON "_ReportToReportCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportToReportCategory_B_index" ON "_ReportToReportCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToReport_AB_unique" ON "_FileToReport"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToReport_B_index" ON "_FileToReport"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_reportWorkflowId_fkey" FOREIGN KEY ("reportWorkflowId") REFERENCES "workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forget_passwords" ADD CONSTRAINT "forget_passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_teams" ADD CONSTRAINT "workspace_teams_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_teams" ADD CONSTRAINT "workspace_teams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_categories" ADD CONSTRAINT "billing_categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billings" ADD CONSTRAINT "billings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_categories" ADD CONSTRAINT "report_categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_categories" ADD CONSTRAINT "report_categories_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_line_approves" ADD CONSTRAINT "workflow_line_approves_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_line_approves" ADD CONSTRAINT "workflow_line_approves_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_line_approves" ADD CONSTRAINT "workflow_line_approves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_approvals" ADD CONSTRAINT "report_approvals_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_approvals" ADD CONSTRAINT "report_approvals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_approvals" ADD CONSTRAINT "report_approvals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_reportApprovalId_fkey" FOREIGN KEY ("reportApprovalId") REFERENCES "report_approvals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToReportCategory" ADD CONSTRAINT "_ReportToReportCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToReportCategory" ADD CONSTRAINT "_ReportToReportCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "report_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToReport" ADD CONSTRAINT "_FileToReport_A_fkey" FOREIGN KEY ("A") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToReport" ADD CONSTRAINT "_FileToReport_B_fkey" FOREIGN KEY ("B") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
