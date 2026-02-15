-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "budget" DECIMAL(10,2),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);