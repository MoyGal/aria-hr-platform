/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Org` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `orgId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Interviewer` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `Interviewer` table. All the data in the column will be lost.
  - You are about to drop the column `retellAgentId` on the `Interviewer` table. All the data in the column will be lost.
  - You are about to drop the column `voice` on the `Interviewer` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Candidate` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `candidatePhone` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalCallId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Made the column `interviewerId` on table `Interview` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `externalId` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voiceId` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Made the column `language` on table `Interviewer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Job_orgId_idx";

-- DropIndex
DROP INDEX "Org_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Job";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Org";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "InterviewAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interviewId" TEXT NOT NULL,
    "sentimentScore" REAL,
    "keyPoints" TEXT,
    "actionItems" TEXT,
    "evaluation" TEXT,
    "fullAnalysis" TEXT,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "recommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterviewAnalysis_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview" ("externalCallId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterviewMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interviewId" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "totalAnswers" INTEGER NOT NULL,
    "avgAnswerLength" REAL NOT NULL,
    "questions" TEXT,
    "answers" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterviewMetrics_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview" ("externalCallId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en-US',
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resume" TEXT,
    "linkedIn" TEXT,
    "position" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Candidate" ("createdAt", "email", "id", "name", "notes", "phone", "updatedAt") SELECT "createdAt", "email", "id", "name", "notes", "phone", "updatedAt" FROM "Candidate";
DROP TABLE "Candidate";
ALTER TABLE "new_Candidate" RENAME TO "Candidate";
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");
CREATE TABLE "new_Interview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalCallId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "candidateName" TEXT,
    "candidateEmail" TEXT,
    "candidatePhone" TEXT NOT NULL,
    "position" TEXT,
    "status" TEXT NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "transcript" TEXT,
    "transcriptUrl" TEXT,
    "summary" TEXT,
    "endReason" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "Interviewer" ("externalId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Interview" ("createdAt", "id", "interviewerId", "updatedAt") SELECT "createdAt", "id", "interviewerId", "updatedAt" FROM "Interview";
DROP TABLE "Interview";
ALTER TABLE "new_Interview" RENAME TO "Interview";
CREATE UNIQUE INDEX "Interview_externalCallId_key" ON "Interview"("externalCallId");
CREATE TABLE "new_Interviewer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "voiceProvider" TEXT NOT NULL DEFAULT 'elevenlabs',
    "description" TEXT,
    "personality" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Interviewer" ("createdAt", "id", "language", "name", "updatedAt") SELECT "createdAt", "id", "language", "name", "updatedAt" FROM "Interviewer";
DROP TABLE "Interviewer";
ALTER TABLE "new_Interviewer" RENAME TO "Interviewer";
CREATE UNIQUE INDEX "Interviewer_externalId_key" ON "Interviewer"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "InterviewAnalysis_interviewId_key" ON "InterviewAnalysis"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewMetrics_interviewId_key" ON "InterviewMetrics"("interviewId");
