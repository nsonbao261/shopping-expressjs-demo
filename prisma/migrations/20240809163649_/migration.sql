/*
  Warnings:

  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `orderId` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `orderId` on the `OrderDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "orderId",
ADD COLUMN     "orderId" SERIAL NOT NULL,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId");

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
