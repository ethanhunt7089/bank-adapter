/*
  Warnings:

  - Added the required column `prefix` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tokens" ADD COLUMN     "prefix" TEXT NOT NULL;
