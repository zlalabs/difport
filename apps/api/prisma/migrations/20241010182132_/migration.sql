/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
