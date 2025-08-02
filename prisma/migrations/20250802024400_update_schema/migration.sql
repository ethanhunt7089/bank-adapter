/*
  Warnings:

  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[client_id]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_secret` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."api_logs" DROP CONSTRAINT "api_logs_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tokens" DROP CONSTRAINT "tokens_client_id_fkey";

-- AlterTable
ALTER TABLE "public"."tokens" ADD COLUMN     "client_secret" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "token_hash" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."clients";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_client_id_key" ON "public"."tokens"("client_id");

-- AddForeignKey
ALTER TABLE "public"."api_logs" ADD CONSTRAINT "api_logs_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."tokens"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
